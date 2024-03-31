import { PrettierOptions } from "./types";
import { window } from "vscode"



enum LineType {
    EMPTY = "empty",
    COMMENT_ONLY = "commentOnly",
    CODE_ONLY = "codeOnly",
    COMMENT_AND_CODE = "commentAndCode",
}

interface LineMetrics {
    lineLength: number;
    openBrackCount: number;
    memAccessCount: number;
    idCount: number;
    lineType: LineType;
    idBad: boolean;
    ids: Array<string>;
}

class Line {
    lineNum: number;
    metrics: LineMetrics;

    constructor(lineNum: number, metrics: LineMetrics, lineText?: string) {
        this.lineNum = lineNum;
        this.metrics = metrics;
    }


}

export function getAnalysis(text: string, options: Partial<PrettierOptions>) {
    let metricInstance = new Metric(); 
    return metricInstance.analyzeMetrics(metricInstance.getMetrics(text, options), options);
}

class Metric {
    withinMultiLineComment: boolean; 
    currentLineIdArray: Array<string>;

    constructor() {
        this.withinMultiLineComment = false; 
        this.currentLineIdArray = []; 
    }

    
    getMetrics(text: string, options: Partial<PrettierOptions>): Array<Line> {
        let metrics = new Array<Line>;    
    
        let lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let metric = {
                lineLength: lines[i].length,
                openBrackCount: this.getOpenBracketsCount(lines[i]),
                ids: this.getIDs(lines[i]),
                memAccessCount: this.getMemAccessCount(lines[i]),
                idCount: this.getIDCount(lines[i]),
                lineType: this.getLineType(lines[i]),
                idBad: this.getIDState(lines[i], options)
            };

            metrics.push(new Line(i + 1, metric, lines[i]));
        }

        this.currentLineIdArray.length = 0; 
    
        return metrics;
    }
    
    getIDCount(line: string): number {
        return this.currentLineIdArray.length;
    }
    
    // checks that IDs are of a valid length
    getIDState(line: string, options: Partial<PrettierOptions>): boolean {
        //use options.IDMinLengthRead for checking. True means ID is longer than min length

        for (const value of this.currentLineIdArray){
            if (options.IDMinLengthRead != undefined &&  value.length < options.IDMinLengthRead){
                return true;
            }
        }
        
        return false;
    }
    
    //stores ids in an array
    getIDs(line: string): Array<string> {
        const fileExtension = window.activeTextEditor?.document.languageId; 
        let ids: Array<string> = [];

        if (fileExtension === "typescript"){

            // multi var declaration on same line with let, const, var
            // const multiDecIdRegex = 

            // covers let, const, var, function, private, public, protected
            const declarationIdRegex = /\b(let|const|var)\s+(\w+)|\bfunction\s+(\w+)|\b(public|private|protected)?\s*function\s+(\w+)|\b(public|private|protected)\s+(\w+)/;
            
            let match;
            if ((match = declarationIdRegex.exec(line)) !== null ){
                if (match[2] != undefined){
                    ids.push(match[2]);
                }
                else if(match[3] != undefined){
                    ids.push(match[3]);
                }
                else if(match[7] != undefined){
                    ids.push(match[7]);
                }
            }

            // e.g. const { fileName, uri, languageId } = doc;
            const destructAssignRegex = /(?:const|let|var)\s+{([^}]+)}/;

            const destructMatch = destructAssignRegex.exec(line);
            if (destructMatch){
                ids = ids.concat(destructMatch[1].split(',').map(id => id.trim()));
            }
        }
        else if (fileExtension === "javascript"){

        }
        
        this.currentLineIdArray = Object.assign([], ids); 
        return ids.filter(Boolean);
    }

    private cutStringsAndComments(line:string): string {
        const type = this.getLineType(line);
        line = line.replace(/'.*?'|".*?"/g, "");

        if (type === LineType.COMMENT_ONLY) return "";
        else if (type === LineType.COMMENT_AND_CODE) {
            line = line.replace(/\/\/.*/g,"");
            line = line.replace(/\/\*.*\*\//g, "");
            line = line.replace(/\/\*.*/g, "");
        }

        return line;
    }
    
    // TODO: do
    getOpenBracketsCount(line: string): number {
        line = this.cutStringsAndComments(line);

        const brackets = line.match(/{/g);

        if (brackets == null) return 0;

        return brackets.length;
    }
    
    // TODO: doo
    getMemAccessCount(line: string): number {
        line = this.cutStringsAndComments(line);

        const memAccesses = line.match(/(?=([^.]\.[a-zA-Z_]))/g);

        if (memAccesses == null) return 0;
        else return memAccesses.length;
    }
    
    getLineType(line: string): LineType {

        const findCodeRegex = /^(?!\s*\/\/)(?!\s*$)(?!\s*\/\*\s*\*\/)(?!\s*\/\*\s*)(?!\s*\*\/).+/;
        const hasCode: boolean = findCodeRegex.test(line);

        const findCommentRegex = /\/\/.*/;

       // multi-line comment
       if (line.includes("/*") && line.includes("*/")){
            if (hasCode) {return LineType.COMMENT_AND_CODE}
            return LineType.COMMENT_ONLY;
       }
       else if (line.includes("/*")){
            this.withinMultiLineComment = true; 

            if (hasCode){ return LineType.COMMENT_AND_CODE; }
            return LineType.COMMENT_ONLY;
       }
       else if (line.includes("*/")){
            this.withinMultiLineComment = false; 
            if (hasCode) { return LineType.COMMENT_AND_CODE; }
            return LineType.COMMENT_ONLY;
       }
       else if (this.withinMultiLineComment){
           return LineType.COMMENT_ONLY; 
        }
        
        // single-line comment
        if (line.length == 0){
            return LineType.EMPTY;
        }

        const lineWithoutLiterals: string = line.replace(/'[^']*'|"[^"]*"/g, "");
        const hasComment : boolean = findCommentRegex.test(lineWithoutLiterals);
    
        if (hasCode && hasComment){
            return LineType.COMMENT_AND_CODE;
        }
        else if (hasCode){
            return LineType.CODE_ONLY; 
        }
        else if (hasComment){
            return LineType.COMMENT_ONLY;
        }
        return LineType.EMPTY;
    }
    
    // TODO: doooo
    analyzeMetrics(metrics: Array<Line>, options: Partial<PrettierOptions>) {
        let result: string = "";
    
        let totalLines = metrics.length;
        //average metrics
        let totalLineLength = 0;
        let totalOpenBrackets = 0;
        let totalMemAccess = 0;
        let totalIDCount = 0;
        //ratio metrics
        let emptyLines = 0;
        let commentOnlyLines = 0;
        let codeOnlyLines = 0;
        let commentAndCodeLines = 0;
    
        let badIDExists = false;
        let badIDs = new Map<number, Array<string>>();
    
        for (let i = 0; i < metrics.length; i++) {
            const line = metrics[i];
            totalLineLength += line.metrics.lineLength;
            totalOpenBrackets += line.metrics.openBrackCount;
            totalMemAccess += line.metrics.memAccessCount;
            totalIDCount += line.metrics.idCount;
    
            if (line.metrics.idBad) {
                badIDExists = true;
    
                //seperate bad ids into array
                let badIDsTemp: Array<string> = [];
                for (let i = 0; i < line.metrics.ids.length; i++){
                    if (typeof options.IDMinLengthRead === 'number'){
                        if (line.metrics.ids[i].length < options.IDMinLengthRead) {
                            badIDsTemp.push(line.metrics.ids[i]);
                        }
                    }
                }
    
                //place line number and bad ids into map
                badIDs.set(line.lineNum, badIDsTemp);
            }
    
            switch (line.metrics.lineType) {
                case LineType.EMPTY:
                    emptyLines++;
                    break;
                case LineType.COMMENT_ONLY:
                    commentOnlyLines++;
                    break;
                case LineType.CODE_ONLY:
                    codeOnlyLines++;
                    break;
                case LineType.COMMENT_AND_CODE:
                    commentAndCodeLines++;
                    break;
            }
        }
    
        let averageLineLength = totalLineLength / totalLines;
        let averageOpenBrackets = totalOpenBrackets / totalLines;
        let averageMemAccess = totalMemAccess / totalLines;
        let averageIDCount = totalIDCount / totalLines;
    
        //comparing empty lines to everything else (taking account of lines that have comments and/or code)
        let whitespaceRatio = emptyLines / (codeOnlyLines + commentAndCodeLines + commentOnlyLines);
    
        //comparing lines of comments to solely lines of code
        let commentToCodeRatio = commentOnlyLines / codeOnlyLines;
    
        //Interpreting results:
    
        result += "Results:\n\n";
        result += "Metric: Your Data / Threshold\n"
        result += "Average line length: " + averageLineLength + " / " + options.lineLengthRead + "\n";
        result += "Average open brackets: " + averageOpenBrackets + " / " + options.nestingCountRead + "\n";
        result += "Average member access: " + averageMemAccess + " / " + options.memAccessRead + "\n";
        result += "Average identifier count: " + averageIDCount + " / " + options.IDCountRead + "\n";
        result += "Whitespace ratio: " + whitespaceRatio + " / " + options.whitespaceRatioRead + "\n";
        result += "Comment to code ratio: " + commentToCodeRatio + " / " + options.commentToCodeRatioRead + "\n\n";
        
        let statAnalysisOut: string = "";
    
        if (typeof options.lineLengthRead === 'number'){
            if (averageLineLength > options.lineLengthRead) {
                result +=  "Your average line length of " + averageLineLength + " is longer than the recommended " + options.lineLengthRead + ". Consider shortening your lines.\n";
                
                //run stat analysis on line length to find outlier
                //if stat analysis finds outlier, add line number to statAnalysisOut
            }
        }
    
        if (typeof options.nestingCountRead === 'number'){
            if (averageOpenBrackets > options.nestingCountRead) {
                result += "Your average number of open brackets of " + averageOpenBrackets + " is greater than the recommended " + options.nestingCountRead + ". Consider utilizing fewer open brackets.\n";
                
                //run stat analysis on open brackets to find outlier
            }
        }
    
        if (typeof options.memAccessRead === 'number'){
            if (averageMemAccess > options.memAccessRead) {
                result += "Your average number of member access operators of " + averageMemAccess + " is greater than the recommended " + options.memAccessRead + ". Consider utilizing fewer member access operators.\n";
    
                
                //run stat analysis on member access to find outlier
            }
        }
    
        if (typeof options.IDCountRead === 'number'){
            if (averageIDCount > options.IDCountRead) {
                result += "Your average number of identifiers of " + averageIDCount + " is greater than the recommended " + options.IDCountRead + ". Consider using fewer identifiers in the same line.\n";
    
                //run stat analysis on ID count to find outlier
    
    
            }
        }
    
        if (badIDExists) {
            //use map to get line numbers and bad ids
            // line x: id1, id2, id3. 
            result += "The following line(s) have IDs that are too short, harming future readability. Consider lengthening them:\n"
        }
    
        if (typeof options.whitespaceRatioRead === 'number'){
            if (whitespaceRatio > options.whitespaceRatioRead) {
                result += "Your ratio of whitespace lines to written lines of " + whitespaceRatio + " exceeds the recommended " + options.whitespaceRatioRead + ". Consider reducing the number of whitespace lines within your code.\n";
    
                
            }
        }
        
        if (typeof options.commentToCodeRatioRead === 'number'){
            if (commentToCodeRatio > options.commentToCodeRatioRead) {
                result += "Your ratio of comment lines to code lines of " + commentToCodeRatio + " exceeds the recommended " + options.commentToCodeRatioRead + ". Consider adding more comments to your code.\n\n"
    
                
            }
        }
        
        if (statAnalysisOut.length > 0) {
            result += "The following line(s) are outliers in their respective metrics:\n\n" + statAnalysisOut;
        }
        
        
    
        return result;
    }
}

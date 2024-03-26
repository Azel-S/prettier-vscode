import { PrettierOptions } from "./types";

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
    return analyzeMetrics(getMetrics(text, options), options);
}

function getMetrics(text: string, options: Partial<PrettierOptions>): Array<Line> {
    let metrics = new Array<Line>;

    let lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let metric = {
            lineLength: lines[i].length,
            openBrackCount: getOpenBracketsCount(lines[i]),
            memAccessCount: getMemAccessCount(lines[i]),
            idCount: getIDCount(lines[i]),
            lineType: getLineType(lines[i]),
            idBad: getIDState(lines[i], options),
            ids: getIDs(lines[i]),
        };

        

        metrics.push(new Line(i + 1, metric, lines[i]));
    }

    return metrics;
}

// TODO: d
function getIDCount(line: string): number {
    return line.length - line.length;
}

// checks that IDs are of a valid length
function getIDState(line: string, options: Partial<PrettierOptions>): boolean {
    //use options.IDMinLengthRead for checking. True means ID is longer than min length
    return false;
}

//stores ids in an array
function getIDs(line: string): Array<string> {
    return [];
}

// TODO: do
function getOpenBracketsCount(line: string): number {
    return line.length - line.length;
}

// TODO: doo
function getMemAccessCount(line: string): number {
    return line.length - line.length;
}

// TODO: dooo
function getLineType(line: string): LineType {
    return LineType.EMPTY;
}

// TODO: doooo
function analyzeMetrics(metrics: Array<Line>, options: Partial<PrettierOptions>) {
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
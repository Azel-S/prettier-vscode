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
    lineType: LineType;
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
            idCount: i,
            openBrackCount: getOpenBracketsCount(lines[i]),
            memAccessCount: getMemAccessCount(lines[i]),
            lineType: getLineType(lines[i])
        }

        metrics.push(new Line(i + 1, metric, lines[i]));
    }

    return metrics;
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
    let result: string = "cool code dude :D";
    
    if (options.allmanStyle) {
        return "allman style is on";
    } else {
        return "allman style is off";
    }

    /*
    let totalLines = metrics.length;
    //average metrics
    let totalLineLength = 0;
    let totalOpenBrackets = 0;
    let totalMemAccess = 0;
    //ratio metrics
    let emptyLines = 0;
    let commentOnlyLines = 0;
    let codeOnlyLines = 0;
    let commentAndCodeLines = 0;

    for (let i = 0; i < metrics.length; i++) {
        const line = metrics[i];
        totalLineLength += line.metrics.lineLength;
        totalOpenBrackets += line.metrics.openBrackCount;
        totalMemAccess += line.metrics.memAccessCount;

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

    //comparing empty lines to everything else (taking account of lines that have comments and/or code)
    let whitespaceRatio = emptyLines / (codeOnlyLines + commentAndCodeLines + commentOnlyLines);

    //comparing lines of comments to solely lines of code
    let commentToCodeRatio = commentOnlyLines / codeOnlyLines;
    */
    

    return result;
}
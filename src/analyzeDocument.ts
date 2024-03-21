enum LineType {
    EMPTY = "empty",
    COMMENT_ONLY = "commentOnly",
    CODE_ONLY = "codeOnly",
    COMMENT_AND_CODE = "commentAndCode",
    PART_OF_MULTILINE_COMMENT = "partOfMultilineComment",
}

interface LineMetrics {
    lineLength: number;
    idCount: number;
    openBrackCount: number;
    memAccessCount: number;
    lineType: LineType;
}

class Line {
    lineNum: number;
    lineText?: string; // Optional
    metrics: LineMetrics;

    constructor(lineNum: number, metrics: LineMetrics, lineText?: string) {
        this.lineNum = lineNum;
        this.lineText = lineText; // Again, this is optional. Depends on if we wanna store the text
        this.metrics = metrics;
    }
}

export function getAnalysis(text: string) {
    return analyzeMetrics(getMetrics(text));
}

function getMetrics(text: string): Array<Line> {
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
function analyzeMetrics(metrics: Array<Line>) {
    let result = "Code Metrics";
    result += "\n";
    result += "This code is so good, I wanna start a religion off of it!";

    return result;
}
import Formatter from "./formatter"

var SCOPE_ENTER_TOKEN = '{'
var SCOPE_EXIT_TOKEN = '}'
var EXPRESSION_TERMINATION_TOKEN = ';'
var ANNOTATION_TOKEN = '@'
var COMMENT_TOKENS = ['//', '*', '/**', '*/']
var COMMENT_START_TOKEN = '/**'
var COMMENT_END_TOKEN = '*/'

export default class JavaFormatter extends Formatter {
    constructor(formatUnit) {
        super(formatUnit)

        this.symbolRegex = new RegExp("\\w");
        this.symbolWithGenericsRegex = new RegExp("[\\w<>\\[\\],]");
    }

    format(codeString) {
        return super.format(codeString,
            ((codeArray, index) => this._expressionIdentifier(codeArray, index)),
            ((lines, index) => this._identifyScope(lines, index, SCOPE_ENTER_TOKEN)),
            ((lines, index) => this._identifyScope(lines, index, SCOPE_EXIT_TOKEN)))
    }

    _expressionIdentifier(codeArray, index) {
        if (codeArray.length > index) {
            let line = codeArray[index].replace('\n', '').trim()
            return line.endsWith(EXPRESSION_TERMINATION_TOKEN)
                || this._checkForSpecialLine(line)
                || this._checkForFunction(line)
        }

        return false
    }

    _scopeEnterFunc(codeArray, index) {
        return this._identifyScope(codeArray, index, SCOPE_ENTER_TOKEN)
    }

    _scopeExitFunc(codeArray, index) {
        return this._identifyScope(codeArray, index,SCOPE_EXIT_TOKEN)
    }

    _identifyScope(codeArray, index, token) {
        if (codeArray.length > 0) {
            let scopeIndex = codeArray[index].indexOf(token)
            if (scopeIndex !== -1) {
                return scopeIndex
            }
            return null
        } else {
            return null
        }
    }

    _checkForSpecialLine(line) {
        return line.startsWith(ANNOTATION_TOKEN)
            || line === ''
            || COMMENT_TOKENS.reduce((result, token) => result || line.startsWith(token), false)
    }
    
    _checkForFunction(line) {
        let matchReturnPossible = true;
        let matchReturn = false;
        let spaceAfterReturn = false;
        let matchFD = false;
        let spaceAfterFD = false;

        for (let i = 0; i < line.length; i++) {
            let c = line[i]
            if (!matchReturn && matchReturnPossible) {
                if (this.symbolRegex.test(c)) {
                    matchReturn = true;
                }
            } else if (matchReturn && !spaceAfterReturn) {
                if (!this.symbolWithGenericsRegex.test(c)) {
                    if (c === " ") {
                        spaceAfterReturn = true;
                    } else {
                        matchReturn = false;
                        matchReturnPossible = false;
                    }
                }
            } else if (spaceAfterReturn && !matchFD) {
                if (this.symbolRegex.test(c)) {
                    matchFD = true;
                } else if (c !== " ") {
                    spaceAfterReturn = false;
                    matchReturn = false;
                    matchReturnPossible = false;
                }
            } else if (matchFD && !spaceAfterFD) {
                if (c === "(") {
                    return true;
                } else if (this.symbolRegex.test(c)) {
                    //Nothing
                } else if (this.symbolWithGenericsRegex.test(c)) {
                    matchFD = false;
                    spaceAfterReturn = false;
                } else {
                    let isSpace = c === " ";
                    matchFD = false;
                    spaceAfterReturn = false;
                    matchReturn = false;
                    matchReturnPossible = isSpace;
                }
            } else if (spaceAfterFD) {
                if (c === "(") {
                    return true;
                } else if (this.symbolRegex.test(c)) {
                    matchFD = false;
                    spaceAfterReturn = false;
                } else if (c === " ") {
                    //Nothing
                } else {
                    matchFD = false;
                    spaceAfterReturn = false;
                    matchReturn = false;
                    matchReturnPossible = false;
                    spaceAfterFD = false;
                }
            } else if (c === " ") {
                matchReturnPossible = true;
            }
        }
        return false;
    }
}

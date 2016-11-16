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
                || this._checkForFunctionSig(line)
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

    _checkForFunctionSig(line) {
       return true
    }
}

import Formatter from "./formatter"

var SCOPE_ENTER_TOKEN = '{'
var SCOPE_EXIT_TOKEN = '}'
var EXPRESSION_TERMINATION_TOKEN = ';'

export default class JavaFormatter extends Formatter {
    constructor(formatUnit) {
        super(formatUnit)
    }

    format(codeString) {
        super.format(codeString, this._expressionIdentifier, this._scopeEnterFunc, this._scopeExitFunc)
    }

    _expressionIdentifier(codeArray, index) {
        if (codeArray.length > index) {
            return codeArray[index].replace('\n', '').trim().endsWith(EXPRESSION_TERMINATION_TOKEN)
        }

        return false
    }

    _scopeEnterFunc(lines) {
        return this._identifyScope(lines, SCOPE_ENTER_TOKEN)
    }

    _scopeExitFunc(lines) {
        return this._identifyScope(lines, SCOPE_EXIT_TOKEN)
    }

    _identifyScope(lines, token) {
        if (lines.length > 0) {
            let exitIndex = lines[0].indexOf(token)
            if (exitIndex !== -1) {
                return exitIndex
            }
            return null
        } else {
            return null
        }
    }
}

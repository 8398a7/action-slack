"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const slack_1 = require("./slack");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let payload = {};
            const text = core.getInput('text');
            switch (core.getInput('type')) {
                case 'auto':
                    throw new Error('not implement');
                case 'success':
                    payload = slack_1.successPayload(text);
                    break;
                case 'failure':
                    payload = slack_1.failurePayload(text, core.getInput('failedMenthon'));
                    break;
                default:
                    payload = JSON.parse(core.getInput('payload'));
            }
            yield slack_1.Send(payload);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();

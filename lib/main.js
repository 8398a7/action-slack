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
            switch (core.getInput('type')) {
                case 'auto':
                    throw new Error('not implement');
                    break;
                case 'success':
                    yield slack_1.Send(slack_1.successPayload());
                    break;
                case 'failed':
                    yield slack_1.Send(slack_1.failedPayload());
                    break;
                default:
                    const text = core.getInput('text');
                    const attachments = JSON.parse(core.getInput('attachments'));
                    yield slack_1.Send({
                        text,
                        attachments,
                    });
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();

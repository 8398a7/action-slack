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
const client_1 = require("./client");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const status = core.getInput('status', { required: true });
            const mention = core.getInput('mention');
            const author_name = core.getInput('author_name');
            const only_mention_fail = core.getInput('only_mention_fail');
            const text = core.getInput('text');
            core.debug(`text: ${text}`);
            core.debug(`mention: ${mention}`);
            core.debug(`status: ${status}`);
            const client = new client_1.Client({
                mention,
                author_name,
                only_mention_fail,
            });
            switch (status) {
                case 'success':
                    yield client.success(text);
                    break;
                case 'fail':
                    yield client.fail(text);
                    break;
                case 'cancel':
                    yield client.cancel(text);
                    break;
                case 'custom':
                    const payload = JSON.parse(core.getInput('payload'));
                    yield client.send(payload);
                    break;
                default:
                    throw new Error('You can specify success or fail or cancel or custom');
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();

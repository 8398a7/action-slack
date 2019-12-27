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
            let status = core.getInput('status', { required: true });
            status = status.toLowerCase();
            const mention = core.getInput('mention');
            const author_name = core.getInput('author_name');
            const only_mention_fail = core.getInput('only_mention_fail');
            const text = core.getInput('text');
            const username = core.getInput('username');
            const icon_emoji = core.getInput('icon_emoji');
            const icon_url = core.getInput('icon_url');
            const channel = core.getInput('channel');
            const rawPayload = core.getInput('payload');
            core.debug(`status: ${status}`);
            core.debug(`mention: ${mention}`);
            core.debug(`author_name: ${author_name}`);
            core.debug(`only_mention_fail: ${only_mention_fail}`);
            core.debug(`text: ${text}`);
            core.debug(`username: ${username}`);
            core.debug(`icon_emoji: ${icon_emoji}`);
            core.debug(`icon_url: ${icon_url}`);
            core.debug(`channel: ${channel}`);
            core.debug(`rawPayload: ${rawPayload}`);
            const client = new client_1.Client({
                status,
                mention,
                author_name,
                only_mention_fail,
                username,
                icon_emoji,
                icon_url,
                channel,
            }, process.env.GITHUB_TOKEN, process.env.SLACK_WEBHOOK_URL);
            switch (status) {
                case 'success':
                    yield client.send(yield client.success(text));
                    break;
                case 'failure':
                    yield client.send(yield client.fail(text));
                    break;
                case 'cancelled':
                    yield client.send(yield client.cancel(text));
                    break;
                case 'custom':
                    var payload = eval(`payload = ${rawPayload}`);
                    yield client.send(payload);
                    break;
                default:
                    throw new Error('You can specify success or failure or cancelled or custom');
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();

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
const github = __importStar(require("@actions/github"));
const webhook_1 = require("@slack/webhook");
class Client {
    constructor(props) {
        this.with = props;
        if (process.env.GITHUB_TOKEN === undefined) {
            throw new Error('Specify secrets.GITHUB_TOKEN');
        }
        this.github = new github.GitHub(process.env.GITHUB_TOKEN);
        if (process.env.SLACK_WEBHOOK_URL === undefined) {
            throw new Error('Specify secrets.SLACK_WEBHOOK_URL');
        }
        this.webhook = new webhook_1.IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
    }
    success(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.payloadTemplate();
            template.attachments[0].color = 'good';
            template.text += ':white_check_mark: Succeeded Github Actions\n';
            template.text += text;
            this.send(template);
        });
    }
    fail(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.payloadTemplate();
            template.attachments[0].color = 'danger';
            if (this.with.only_mention_fail !== '') {
                template.text += `<!${this.with.only_mention_fail}> `;
            }
            template.text += ':no_entry: Failed Github Actions\n';
            template.text += text;
            this.send(template);
        });
    }
    cancel(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.payloadTemplate();
            template.attachments[0].color = 'warning';
            template.text += ':warning: Cancelded Github Actions\n';
            template.text += text;
            this.send(template);
        });
    }
    send(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            core.debug(JSON.stringify(github.context, null, 2));
            yield this.webhook.send(payload);
            core.debug('send message');
        });
    }
    payloadTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sha } = github.context;
            const { owner, repo } = github.context.repo;
            const commit = yield this.github.repos.getCommit({ owner, repo, ref: sha });
            const { author } = commit.data.commit;
            let text = '';
            if (this.with.mention !== '') {
                text += `<!${this.with.mention}> `;
            }
            return {
                text: text,
                attachments: [
                    {
                        color: '',
                        author_name: this.with.author_name,
                        username: this.with.username,
                        icon_emoji: this.with.icon_emoji,
                        icon_url: this.with.icon_url,
                        channel: this.with.channel,
                        fields: [
                            {
                                title: 'repo',
                                value: `<https://github.com/${owner}/${repo}|${owner}/${repo}>`,
                                short: true,
                            },
                            {
                                title: 'message',
                                value: commit.data.commit.message,
                                short: true,
                            },
                            {
                                title: 'commit',
                                value: `<https://github.com/${owner}/${repo}/commit/${sha}|${sha}>`,
                                short: true,
                            },
                            {
                                title: 'author',
                                value: `${author.name}<${author.email}>`,
                                short: true,
                            },
                            {
                                title: 'action',
                                value: `<https://github.com/${owner}/${repo}/commit/${sha}/checks|action>`,
                                short: true,
                            },
                            {
                                title: 'eventName',
                                value: github.context.eventName,
                                short: true,
                            },
                            { title: 'ref', value: github.context.ref, short: true },
                            { title: 'workflow', value: github.context.workflow, short: true },
                        ],
                    },
                ],
            };
        });
    }
}
exports.Client = Client;

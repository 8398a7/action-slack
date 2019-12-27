"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
const groupMention = ['here', 'channel'];
class Client {
    constructor(props, token, webhookUrl) {
        this.with = props;
        if (props.status !== 'custom') {
            if (token === undefined) {
                throw new Error('Specify secrets.GITHUB_TOKEN');
            }
            this.github = new github.GitHub(token);
        }
        if (webhookUrl === undefined) {
            throw new Error('Specify secrets.SLACK_WEBHOOK_URL');
        }
        this.webhook = new webhook_1.IncomingWebhook(webhookUrl);
    }
    success(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.payloadTemplate();
            template.attachments[0].color = 'good';
            template.text += ':white_check_mark: Succeeded GitHub Actions\n';
            template.text += text;
            return template;
        });
    }
    fail(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.payloadTemplate();
            template.attachments[0].color = 'danger';
            template.text += this.mentionText(this.with.only_mention_fail);
            template.text += ':no_entry: Failed GitHub Actions\n';
            template.text += text;
            return template;
        });
    }
    cancel(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.payloadTemplate();
            template.attachments[0].color = 'warning';
            template.text += ':warning: Canceled GitHub Actions\n';
            template.text += text;
            return template;
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
            const text = this.mentionText(this.with.mention);
            return {
                text,
                attachments: [
                    {
                        color: '',
                        author_name: this.with.author_name,
                        username: this.with.username,
                        icon_emoji: this.with.icon_emoji,
                        icon_url: this.with.icon_url,
                        channel: this.with.channel,
                        fields: yield this.fields(),
                    },
                ],
            };
        });
    }
    fields() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.github === undefined) {
                throw Error('Specify secrets.GITHUB_TOKEN');
            }
            const { sha } = github.context;
            const { owner, repo } = github.context.repo;
            const commit = yield this.github.repos.getCommit({ owner, repo, ref: sha });
            const { author } = commit.data.commit;
            return [
                this.repo,
                {
                    title: 'message',
                    value: commit.data.commit.message,
                    short: true,
                },
                this.commit,
                {
                    title: 'author',
                    value: `${author.name}<${author.email}>`,
                    short: true,
                },
                this.action,
                this.eventName,
                this.ref,
                this.workflow,
            ];
        });
    }
    get commit() {
        const { sha } = github.context;
        const { owner, repo } = github.context.repo;
        return {
            title: 'commit',
            value: `<https://github.com/${owner}/${repo}/commit/${sha}|${sha}>`,
            short: true,
        };
    }
    get repo() {
        const { owner, repo } = github.context.repo;
        return {
            title: 'repo',
            value: `<https://github.com/${owner}/${repo}|${owner}/${repo}>`,
            short: true,
        };
    }
    get action() {
        const { sha } = github.context;
        const { owner, repo } = github.context.repo;
        return {
            title: 'action',
            value: `<https://github.com/${owner}/${repo}/commit/${sha}/checks|action>`,
            short: true,
        };
    }
    get eventName() {
        return {
            title: 'eventName',
            value: github.context.eventName,
            short: true,
        };
    }
    get ref() {
        return { title: 'ref', value: github.context.ref, short: true };
    }
    get workflow() {
        return { title: 'workflow', value: github.context.workflow, short: true };
    }
    mentionText(mention) {
        if (groupMention.includes(mention)) {
            return `<!${mention}> `;
        }
        else if (mention !== '') {
            const text = mention
                .split(',')
                .map(userId => `<@${userId}>`)
                .join(' ');
            return `${text} `;
        }
        return '';
    }
}
exports.Client = Client;

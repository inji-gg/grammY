import { InlineKeyboard, Keyboard } from "../../src/convenience/keyboard.ts";
import { type LoginUrl } from "../../src/types.ts";
import { assertEquals, describe, it } from "../deps.test.ts";

describe("Keyboard", () => {
    it("should take initial buttons", () => {
        const keyboard = new Keyboard([[{ text: "button" }]]);
        assertEquals(keyboard.build(), [[{ text: "button" }]]);
    });

    it("should create rows and columns", () => {
        const keyboard = new Keyboard([[{ text: "0" }]])
            .add({ text: "1" }, { text: "2" }).row()
            .add({ text: "3" }, { text: "4" }).add({ text: "5" });
        assertEquals(keyboard.build(), [
            [{ text: "0" }, { text: "1" }, { text: "2" }],
            [{ text: "3" }, { text: "4" }, { text: "5" }],
        ]);
    });

    it("should support different buttons", () => {
        const keyboard = new Keyboard()
            .text("button")
            .requestContact("contact")
            .requestLocation("location")
            .requestPoll("poll", "quiz")
            .webApp("web app", "https://grammy.dev")
            .requestUser("user", 12, { user_is_bot: true })
            .requestChat("chat", 42);
        assertEquals(keyboard.build(), [[
            { text: "button" },
            { text: "contact", request_contact: true },
            { text: "location", request_location: true },
            { text: "poll", request_poll: { type: "quiz" } },
            { text: "web app", web_app: { url: "https://grammy.dev" } },
            {
                text: "user",
                request_user: { request_id: 12, user_is_bot: true },
            },
            {
                text: "chat",
                request_chat: { request_id: 42, chat_is_channel: false },
            },
        ]]);
    });

    it("should support reply markup options", () => {
        const keyboard = new Keyboard();
        assertEquals(keyboard.is_persistent, undefined);
        assertEquals(keyboard.selective, undefined);
        assertEquals(keyboard.one_time_keyboard, undefined);
        assertEquals(keyboard.resize_keyboard, undefined);
        assertEquals(keyboard.input_field_placeholder, undefined);
        keyboard
            .persistent()
            .selected(false)
            .oneTime(true)
            .resized(false)
            .placeholder("placeholder");
        assertEquals(keyboard.is_persistent, true);
        assertEquals(keyboard.selective, false);
        assertEquals(keyboard.one_time_keyboard, true);
        assertEquals(keyboard.resize_keyboard, false);
        assertEquals(keyboard.input_field_placeholder, "placeholder");
    });
});

describe("InlineKeyboard", () => {
    const btn = { text: "text", callback_data: "data" };

    it("should take initial buttons", () => {
        const keyboard = new InlineKeyboard([[btn], [btn, btn]]);
        assertEquals(keyboard.inline_keyboard, [[btn], [btn, btn]]);
    });

    it("should create rows and columns", () => {
        const keyboard = new InlineKeyboard([[btn]])
            .add(btn, btn).row()
            .add(btn, btn).add(btn);
        assertEquals(keyboard.inline_keyboard, [
            [btn, btn, btn],
            [btn, btn, btn],
        ]);
    });

    it("should support different buttons", () => {
        const url: LoginUrl = {
            url: "https://grammy.dev",
            forward_text: "forward",
            bot_username: "bot",
            request_write_access: true,
        };
        const keyboard = new InlineKeyboard()
            .url("url", "https://grammy.dev")
            .text("button")
            .text("button", "data")
            .webApp("web app", "https://grammy.dev")
            .login("login", "https://grammy.dev")
            .login("login", url)
            .switchInline("inline")
            .switchInline("inline", "query")
            .switchInlineCurrent("inline current")
            .switchInlineCurrent("inline current", "query")
            .switchInlineChosen("inline chosen chat")
            .switchInlineChosen("inline chosen chat", {
                allow_bot_chats: true,
            })
            .game("game")
            .pay("pay");
        assertEquals(keyboard.inline_keyboard, [
            [
                { text: "url", url: "https://grammy.dev" },
                { text: "button", callback_data: "button" },
                { text: "button", callback_data: "data" },
                { text: "web app", web_app: { url: "https://grammy.dev" } },
                { text: "login", login_url: { url: "https://grammy.dev" } },
                { text: "login", login_url: url },
                { text: "inline", switch_inline_query: "" },
                { text: "inline", switch_inline_query: "query" },
                {
                    switch_inline_query_current_chat: "",
                    text: "inline current",
                },
                {
                    switch_inline_query_current_chat: "query",
                    text: "inline current",
                },
                {
                    switch_inline_query_chosen_chat: {},
                    text: "inline chosen chat",
                },
                {
                    switch_inline_query_chosen_chat: { allow_bot_chats: true },
                    text: "inline chosen chat",
                },
                { text: "game", callback_game: {} },
                { text: "pay", pay: true },
            ],
        ]);
    });
});

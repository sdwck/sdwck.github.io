export const helloWords = ["there", "world", "friend"];
export function randomQuote(): string {
    const quotes = [
        "solitude_text",
        "btw I add both C# and ASP.NET Core when a lot of code was created that wasn't exposed in the API",
        "nsfw projects are not listed here",
        "глаза болят",
        "random text",
        "nira is watching you",
        "did you know that you can spin stars in the background",
        "open console"
    ] as const;
    return quotes[Math.floor(Math.random() * quotes.length)];
}

export function randomTitle(): string {
    const titles = [
        "sdwck"
    ] as const;

    const today = new Date();
    const isLeap = ((today.getFullYear() % 4 == 0) && (today.getFullYear() % 100 != 0)) || (today.getFullYear() % 400 == 0);

    const holidays: Record<string, string> = {
        "01-01": "Happy New Year!",
        "12-25": "Merry Christmas!",
        "10-31": "Happy Halloween!",
        "02-14": "Happy Valentine's Day!",
        "06-01": "Happy Children's Day!",
        "04-01": "Happy Chips Day!",
        "07-04": "Happy Independence Day!",
        "05-01": "Happy Labor Day!",
        "03-08": "Happy Women's Day!",
    };

    if (isLeap) {
        holidays["09-12"] = "Happy Programmer's Day!";
    } else {
        holidays["09-13"] = "Happy Programmer's Day!";
    }

    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const key = `${month}-${day}`;

    if (holidays[key]) {
        return holidays[key];
    }

    return titles[Math.floor(Math.random() * titles.length)];
}

export function randomKaomoji(): string {
    const kaomojis = [
        "(＾▽＾)",
        "(￣▽￣)",
        "(•‿•)",
        "(✿◠‿◠)",
        "(ᵔᴥᵔ)",
        "(≧◡≦)",
        "(•ω•)",
        "(^人^)",
        "(^._.^)ﾉ",
        "(=^･ω･^=)",
        "(=^･ｪ･^=)",
        "(=①ω①=)",
        "(=^‥^=)",
        "(=^･^=)",
        "(^･o･^)ﾉ”",
        "(˶ᵔ ᵕ ᵔ˶)",
        "(..◜ᴗ◝..)",
        "randomKaomoji()"
    ] as const;
    
    return kaomojis[Math.floor(Math.random() * kaomojis.length)];
}
export default function Footer() {
    return (
        <footer className="w-full border-t border-white/10 py-8 sm:py-10">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs sm:text-sm opacity-70 text-center sm:text-left">
                © {" " + new Date().getFullYear()} {" Vladislav B. "}
                (<a
                    href="https://github.com/sdwck"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 transition-opacity duration-200 underline underline-offset-3">
                    sdwck
                </a>)
            </div>
        </footer>
    );
}
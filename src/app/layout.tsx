import { Poppins } from "next/font/google";
import "../styles/globals.css";
import ClientProvider from "@/providers/ClientProvider";
import Script from "next/script";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "CIA Serang",
  description: "CIA Serang adalah website resmi CIA Serang",
  category: "website",
  authors: { name: "Azzaxy" },
  keywords: [
    "CIA Serang",
    "CIA Serang Website",
    "CIA Serang Official",
    "CIA Serang Resmi",
    "Futsal Serang",
    "Badminton Serang",
    "Tenis Meja Serang",
  ],
  creator: "Abdurrohman Azis",
  publisher: "Abdurrohman Azis",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased`}
        suppressHydrationWarning
      >
        <ClientProvider>{children}</ClientProvider>
        <Script id="chatbase-script" strategy="afterInteractive">
          {`
            (function(){
              if(!window.chatbase||window.chatbase("getState")!=="initialized"){
                window.chatbase=(...arguments)=>{
                  if(!window.chatbase.q){window.chatbase.q=[]}
                  window.chatbase.q.push(arguments)
                };
                window.chatbase=new Proxy(window.chatbase,{
                  get(target,prop){
                    if(prop==="q"){return target.q}
                    return(...args)=>target(prop,...args)
                  }
                })
              }
              const onLoad=function(){
                const script=document.createElement("script");
                script.src="https://www.chatbase.co/embed.min.js";
                script.id="4syzbyNcXkpVvka-O7Bjp";
                script.domain="www.chatbase.co";
                document.body.appendChild(script)
              };
              if(document.readyState==="complete"){onLoad()}
              else{window.addEventListener("load",onLoad)}
            })();
          `}
        </Script>
      </body>
    </html>
  );
}

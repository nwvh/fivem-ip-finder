"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { ModeToggle } from "@/components/mode-toggle";
import { useEffect, useState } from "react";
import { Github, Loader2 } from "lucide-react";
import {
  Card,

} from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import WordPullUp from "@/components/magicui/word-pull-up";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link";
import ShineBorder from "@/components/magicui/shine-border";
import Particles from "@/components/magicui/particles";
import { useTheme } from "next-themes";
const formSchema = z.object({
  cfxlink: z.string()
    .url({ message: "Please provide a valid URL." })
    .includes("cfx.re/join/", { message: "Invalid CFX Join link." }),
})

const faq = [
  {
    title: "How does this work?",
    text: "When you perform a GET request on any CFX Join link, you can see the server IP in the headers, specifically the one called x-citizenfx-url."
  },

]



export default function Home() {
  const [isLoading, setLoading] = useState(false);

  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cfxlink: "",
    },
  });

  const setClipboard = (value: string) => {
    const clipElem = document.createElement('textarea');
    clipElem.value = value;
    document.body.appendChild(clipElem);
    clipElem.select();
    document.execCommand('copy');
    document.body.removeChild(clipElem);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    const result = await (await fetch("/api/getIP?joinLink=" + values.cfxlink)).json()
    setTimeout(() => {
      try {
        {
          console.log(result)
          result.message === "error" ?
            toast({
              title: "Failed",
              description: `Server does not exist, or is offline.`,
              variant: "destructive"
            })
            :
            toast({
              title: "Obtained IP",
              description: `IP Address: ${result.message ? `${result.message}` : "Failed to fetch"}`,
              action: (
                <ToastAction altText="copy" onClick={() => { setClipboard(result.message) }}>Copy IP</ToastAction>
              ),
            });
        }
        setLoading(false)
      } catch (e) {
        console.log("Error: " + e)
      }
    }, 1);
  }
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);
  return (
    <div>
      <main className="min-h-screen">
        <div className="p-5 flex justify-between">
          <h1 className="text-xl font-bold tracking-[-0.02em] text-black dark:text-white md:text-xl ">
            🐌 IP Finder
          </h1>
          <footer className="z-20">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Link href={"https://github.com/nwvh/fivem-ip-finder"}>
                  <Github className="h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
                </Link>
              </Button>
              <ModeToggle />
            </div>
          </footer>
        </div>
        <div>
          <div className="">
            <WordPullUp
              className="text-4xl font-bold text-black dark:text-white md:text-5xl"
              words="FiveM Server IP Finder"
            />
          </div>
          <div className="flex justify-center items-center m-5">
            <p className="dark:text-neutral-300 max-w-2xl mx-auto my-2 text-md text-center relative z-10">
              Simple tool that you can use to retrieve the IP and port of any FiveM server.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center m-5">
          <ShineBorder
            className="text-center text-2xl font-bold capitalize"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            <Card className="md:w-[30vw] p-5">

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="cfxlink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CFX Join Link</FormLabel>
                        <FormControl>
                          <div className="flex gap-3">
                            <Input placeholder="https://cfx.re/join/XXXXXX/" {...field} />
                            <Button type="submit" disabled={isLoading ? true : false}>
                              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""}

                              {isLoading ? "Obtaining IP..." : "Get IP"}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          The CFX.re server join link you want to obtain the IP of.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </Card>
          </ShineBorder>
        </div>
        <div>
          <div className="m-[5rem]">
            <WordPullUp
              className="text-4xl font-bold tracking-[-0.02em] text-black dark:text-white md:text-7xl md:leading-[5rem]"
              words="FAQ"
            />
          </div>
          <div className="flex justify-center items-center m-5">

            <Card className="p-5 md:min-w-[50vw] min-w-full z-10">
              {
                faq.map((item, key) => (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={`item-${key}`}>
                      <AccordionTrigger>{item.title}</AccordionTrigger>
                      <AccordionContent>
                        {item.text}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))
              }

            </Card>
          </div>
        </div>


      </main>
      <footer className="">
        <div className="w-full mx-auto max-w-screen-xl my-[-3rem] flex items-center justify-center">
          <span className="text-sm text-gray-500 text-center dark:text-gray-400">
            Not affiliated with CFX.re, Take Two Interactive or Rockstar Games.
          </span>
        </div>
      </footer>
      <Particles
        className="absolute inset-0"
        quantity={300}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
}

import { Moon02Icon, Search01Icon } from "@hugeicons/core-free-icons"
import {
  Button,
  Card,
  HugeiconsIcon,
  InputText,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ThemeProvider,
  Toaster,
  TooltipProvider,
  toast,
  useTheme,
} from "@lucasdost/design-system"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      iconOnly
      aria-label="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <HugeiconsIcon icon={Moon02Icon} />
    </Button>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Toaster>
          <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 bg-background-primary p-8">
            <header className="flex items-center justify-between">
              <h1 className="text-heading-large text-text-primary">
                @lucasdost/design-system
              </h1>
              <ThemeToggle />
            </header>

            <Tabs defaultValue="form">
              <TabsList>
                <TabsTrigger value="form">Form</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
              </TabsList>

              <TabsContent value="form" className="flex flex-col gap-4 pt-6">
                <InputText label="Name" placeholder="Your name" />
                <InputText
                  label="Search"
                  icon={Search01Icon}
                  placeholder="Search"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      toast.add({ title: "Saved", type: "success" })
                    }
                  >
                    Save
                  </Button>
                  <Button variant="secondary">Cancel</Button>
                </div>
              </TabsContent>

              <TabsContent
                value="cards"
                className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2"
              >
                <Card label="Tokens" description="From the Figma variables." />
                <Card label="Components" description="59 React components." />
              </TabsContent>
            </Tabs>
          </main>
        </Toaster>
      </TooltipProvider>
    </ThemeProvider>
  )
}

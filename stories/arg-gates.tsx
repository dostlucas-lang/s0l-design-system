import type { Args, Decorator } from "@storybook/react-vite"
import { useArgs, useEffect } from "storybook/preview-api"

// Storybook's `if` takes a single condition. A control that depends on
// several (e.g. Ribbon Color: Style=Container AND Show Ribbon) points its `if`
// at a gate instead: a hidden boolean arg that a decorator keeps equal to the
// condition. Panel rule: a control shows only when the props it depends on
// make it take effect.
//
//   const gates = argGates<StoryArgs>({
//     gateRibbonColor: (a) => a.variant === "container" && a.showRibbon,
//   })
//   meta: { args: gates.withGates(defaults), argTypes: { ...gates.argTypes,
//     ribbonColor: { if: { arg: "gateRibbonColor" } } },
//     decorators: [gates.decorator] }
export function argGates<A extends Args>(
  conditions: Record<string, (args: A) => boolean>
) {
  const names = Object.keys(conditions)

  const compute = (args: A) =>
    Object.fromEntries(names.map((name) => [name, conditions[name](args)]))

  // Hidden from the table; only read by the controls' `if`.
  const argTypes = Object.fromEntries(
    names.map((name) => [name, { control: false, table: { disable: true } }])
  )

  // Fills in the gates for a set of args, so a story starts with the right
  // controls instead of correcting them after its first render.
  const withGates = <T extends Partial<A>>(args: T, base?: Partial<A>) => ({
    ...args,
    ...compute({ ...base, ...args } as unknown as A),
  })

  // Re-evaluates the gates when a control changes.
  const decorator: Decorator = function ArgGates(Story, context) {
    const [, updateArgs] = useArgs()
    const allArgs = context.allArgs as A
    const expected = compute(allArgs)
    const stale = Object.fromEntries(
      Object.entries(expected).filter(
        ([name, value]) => allArgs[name] !== value
      )
    )
    const staleKey = JSON.stringify(stale)
    useEffect(() => {
      if (staleKey !== "{}") updateArgs(JSON.parse(staleKey))
    }, [staleKey, updateArgs])
    return <Story />
  }

  return { argTypes, withGates, decorator }
}

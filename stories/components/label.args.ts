// The Label controls, shared by its own story and the Inputs that render it.
export const labelArgs = {
  label: "Label",
  // Off by default, but listed: the panel follows this order.
  requirement: undefined,
  info: undefined,
}

export const labelArgTypes = {
  label: { control: "text" },
  requirement: {
    control: "select",
    options: ["(obrigatório)", "(opcional)"],
  },
  info: { control: "text" },
} as const

const inLabelSection = { table: { category: "Label" } }

// In the Inputs, the same controls in a Label section. The state comes from
// their `disabled` and `readOnly`.
export const inputLabelArgTypes = {
  label: { ...labelArgTypes.label, ...inLabelSection },
  requirement: { ...labelArgTypes.requirement, ...inLabelSection },
  info: { ...labelArgTypes.info, ...inLabelSection },
}

import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import {
  FileItem,
  InputFile,
  type FileItemProps,
} from "@/components/ui/input-file"
import { inputLabelArgTypes, labelArgs } from "./label.args"

const description = "Carregue até 10 arquivos PDF ou DOCX (tamanho máx. 10MB)"

type FileItemFields = Pick<
  FileItemProps,
  "state" | "format" | "downloadLabel" | "removeLabel"
> & {
  fileName: string
  description: string
}

// Each of the three items has its own args, like `item2State`. The controls
// only show the ones of the selected item.
type FileItemArgs = {
  [
    Field in keyof FileItemFields as `item${1 | 2 | 3}${Capitalize<Field>}`
  ]?: FileItemFields[Field]
}

type InputFileStoryArgs = React.ComponentProps<typeof InputFile> &
  FileItemArgs & {
    selectedItem?: number
    onDownload?: () => void
    onRemove?: () => void
  }

const uploadedFileItem: FileItemFields = {
  state: "uploaded",
  fileName: "File_name",
  description: "PDF - 32 MB",
  format: "PDF",
  downloadLabel: "Download",
  removeLabel: "Remove",
}

// The three items in Figma.
const fileItems: FileItemFields[] = [
  {
    ...uploadedFileItem,
    state: "loading",
    description: "25% - Enviando arquivo...",
  },
  uploadedFileItem,
  uploadedFileItem,
]

const fileItemControls = {
  state: {
    description:
      'Inside a disabled Input File, the state is always "disabled".',
    control: "select",
    options: ["loading", "uploaded", "error", "disabled"],
    summary: '"loading" | "uploaded" | "error" | "disabled"',
  },
  fileName: {
    description: "First line of the item.",
    control: "text",
    summary: "ReactNode",
  },
  description: {
    description: "Second line: the progress, the type and size, or the error.",
    control: "text",
    summary: "ReactNode",
  },
  format: {
    description: "The text in the .Icon File Format tag.",
    control: "text",
    summary: "string",
  },
  downloadLabel: {
    description: "Accessible name of the Download button.",
    control: "text",
    summary: "string",
  },
  removeLabel: {
    description: "Accessible name of the remove button.",
    control: "text",
    summary: "string",
  },
}

const fileItemKey = (item: number, field: string) =>
  `item${item}${field[0].toUpperCase()}${field.slice(1)}`

const fileItemArgs = Object.fromEntries(
  fileItems.flatMap((fields, index) =>
    Object.entries(fields).map(([field, value]) => [
      fileItemKey(index + 1, field),
      value,
    ])
  )
)

const fileItemArgTypes = Object.fromEntries(
  fileItems.flatMap((_, index) =>
    Object.entries(fileItemControls).map(([field, { summary, ...argType }]) => [
      fileItemKey(index + 1, field),
      {
        ...argType,
        name: field,
        if: { arg: "selectedItem", eq: index + 1 },
        table: { category: "File Item", type: { summary } },
      },
    ])
  )
)

const getFileItemProps = (args: InputFileStoryArgs, item: number) =>
  Object.fromEntries(
    Object.keys(fileItemControls).map((field) => [
      field,
      args[fileItemKey(item, field) as keyof FileItemArgs],
    ])
  ) as FileItemFields

const hidden = { table: { disable: true } }

const meta = {
  title: "Components/Input File",
  component: InputFile,
  tags: ["autodocs"],
  parameters: {
    // Fills the canvas, so resizing it shows the component following its parent.
    layout: "padded",
    docs: {
      description: {
        component:
          "An Upload Area to pick or drop files, above the File Item List. Without `multiple` it takes a single file: the Upload Area hides while there's a File Item, and comes back when it's removed. Mirrors the Figma Input File component, State (Default / Hover / Error / Disabled), and File Item, State (Loading / Uploaded / Error / Disabled).",
      },
    },
  },
  args: {
    ...labelArgs,
    description,
    accept: ".pdf,.docx",
    multiple: true,
    disabled: false,
    onFilesChange: fn(),
    onFilesRejected: fn(),
    selectedItem: 1,
    ...fileItemArgs,
    onDownload: fn(),
    onRemove: fn(),
  },
  argTypes: {
    ...inputLabelArgTypes,
    helpText: { control: "text" },
    error: { control: "text" },
    className: hidden,
    onFilesChange: hidden,
    onFilesRejected: hidden,
    children: hidden,
    selectedItem: {
      name: "item",
      description:
        "The item that the controls below edit. Without `multiple`, it's the one shown.",
      control: {
        type: "select",
        labels: { 1: "Item 1", 2: "Item 2", 3: "Item 3" },
      },
      options: [1, 2, 3],
      table: { category: "File Item", type: { summary: "1 | 2 | 3" } },
    },
    ...fileItemArgTypes,
    onDownload: hidden,
    onRemove: hidden,
  },
  // `args` leaves out the hidden controls, `allArgs` has the three items.
  render: (args, { allArgs }) => {
    const renderItem = (item: number) => (
      <FileItem
        key={item}
        {...getFileItemProps(allArgs, item)}
        onDownload={args.onDownload}
        onRemove={args.onRemove}
      />
    )

    return (
      <InputFile {...args}>
        {args.multiple
          ? fileItems.map((_, index) => renderItem(index + 1))
          : renderItem(args.selectedItem ?? 1)}
      </InputFile>
    )
  },
} satisfies Meta<InputFileStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithHelpText: Story = {
  args: { helpText: "Text Help" },
}

export const WithError: Story = {
  args: { error: "Text Error" },
}

export const Disabled: Story = {
  args: { disabled: true, helpText: "Text Help" },
}

export const FileItemStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10">
      <FileItem
        state="loading"
        fileName="File_name"
        description="25% - Enviando arquivo..."
      />
      <FileItem
        state="uploaded"
        fileName="File_name"
        description="PDF - 32 MB"
        onDownload={fn()}
        onRemove={fn()}
      />
      <FileItem
        state="error"
        fileName="File_name"
        description="Falha na importação"
      />
      <FileItem
        state="disabled"
        fileName="File_name"
        description="PDF - 32 MB"
      />
      <FileItem
        fileName="Um_nome_de_arquivo_bem_longo_que_nao_cabe_em_uma_linha_so.docx"
        format="DOCX"
        description="DOCX - 2 MB"
        onDownload={fn()}
        onRemove={fn()}
      />
    </div>
  ),
}

type Upload = { id: string; file: File; progress: number }

function SimulatedUpload(props: React.ComponentProps<typeof InputFile>) {
  const [uploads, setUploads] = React.useState<Upload[]>([])
  const uploading = uploads.some((upload) => upload.progress < 100)

  React.useEffect(() => {
    if (!uploading) return
    const interval = setInterval(() => {
      setUploads((current) =>
        current.map((upload) => ({
          ...upload,
          progress: Math.min(upload.progress + 25, 100),
        }))
      )
    }, 700)
    return () => clearInterval(interval)
  }, [uploading])

  return (
    <InputFile
      {...props}
      onFilesChange={(files) =>
        setUploads((current) => [
          ...current,
          ...files.map((file) => ({
            id: crypto.randomUUID(),
            file,
            progress: 0,
          })),
        ])
      }
    >
      {uploads.map(({ id, file, progress }) => {
        const format = file.name.split(".").pop()?.toUpperCase()
        const size = `${(file.size / 1024 / 1024).toFixed(1)} MB`
        return progress < 100 ? (
          <FileItem
            key={id}
            state="loading"
            fileName={file.name}
            format={format}
            description={`${progress}% - Enviando arquivo...`}
          />
        ) : (
          <FileItem
            key={id}
            fileName={file.name}
            format={format}
            description={`${format} - ${size}`}
            onDownload={() => {}}
            onRemove={() =>
              setUploads((current) =>
                current.filter((upload) => upload.id !== id)
              )
            }
          />
        )
      })}
    </InputFile>
  )
}

export const SingleFile: Story = {
  args: { multiple: false },
  render: ({ label, description, accept, multiple, disabled }) => (
    <SimulatedUpload
      label={label}
      description={description}
      accept={accept}
      multiple={multiple}
      disabled={disabled}
    />
  ),
}

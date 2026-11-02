"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { figmaIcon, HugeiconsIcon } from "@/components/ui/icon"
import { IconColors } from "@/components/ui/icon-colors"
import {
  InputLabel,
  InputMessage,
  InputRoot,
  useInputBase,
  type InputBaseProps,
} from "@/components/ui/input-base"

// Mirrors the Figma Input File and File Item components.
// - Input File: State (Default / Hover / Error / Disabled). Hover comes from the
//   browser, and dragging a file over the Upload Area looks the same; Error and
//   Disabled come from props. Figma has no Read Only here.
// - File Item: State (Loading / Uploaded / Error / Disabled). Items inside a
//   disabled Input File are disabled too.
//
// The Upload Area only hands over the files: the parent uploads them and renders
// one File Item per file as `children`. That's why the native input is emptied
// after each pick, and why it takes no form props like `name`. Without
// `multiple` it takes a single file: the Upload Area hides while there's a File
// Item, and comes back when it's removed.

// Figma's Upload, Download and Trash aren't drawn like the Hugeicons ones.
const UploadIcon = figmaIcon(
  "M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 8L12 3L17 8M12 3V15"
)
const DownloadIcon = figmaIcon(
  "M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 10L12 15L7 10M12 15V3"
)
const TrashIcon = figmaIcon(
  "M3 6H5M5 6H21M5 6V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
)

const SHEET_PATH =
  "M5.12517 0H17.7L28.7 10.9999L28.8 31.3134C28.8 33.9041 26.558 36 23.7963 36H5.01329C2.24203 36 0 33.9041 0 31.3134V4.68661C0 2.09591 2.35385 0 5.12517 0Z"

// The .Icon File Format sub-component: the 36px sheet of paper, on the White and
// Gray/200 primitives like in Figma, with the format in a tag on top of it.
function IconFileFormat({
  format = "PDF",
  className,
  ...props
}: React.ComponentProps<"span"> & {
  /** The text in the tag, like "PDF" or "DOCX". */
  format?: string
}) {
  const maskId = React.useId()

  return (
    <span
      data-slot="icon-file-format"
      className={cn("relative block size-9 shrink-0", className)}
      {...props}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 size-full"
      >
        <g transform="translate(6.3 0)">
          <mask id={maskId} fill="white">
            <path d={SHEET_PATH} />
          </mask>
          {/* Masked to the shape, so the 2px stroke shows as Figma's 1px inside. */}
          <path
            d={SHEET_PATH}
            mask={`url(#${maskId})`}
            strokeWidth="2"
            className="fill-white stroke-gray-200"
          />
        </g>
        <path
          transform="translate(23.5 0)"
          d="M0 8V0H0.5L11.5 11V11.5H3.5C1.5 11.5 0 10 0 8Z"
          className="fill-gray-200"
        />
      </svg>
      {/* Figma centers the tag 1.35px left of the middle: over the sheet. */}
      <span className="absolute top-[47.5%] bottom-[15%] left-[calc(50%-1.35px)] flex -translate-x-1/2 items-center justify-center rounded-xs bg-background-accent-strong px-1.5 py-0.5 font-secondary text-[8px] leading-normal font-bold whitespace-nowrap text-text-on-color">
        {format}
      </span>
    </span>
  )
}

const InputFileContext = React.createContext({ disabled: false })

type FileItemState = "loading" | "uploaded" | "error" | "disabled"

const fileItemDescriptionColor: Record<FileItemState, string> = {
  loading: "text-text-secondary",
  uploaded: "text-text-secondary",
  error: "text-text-danger-standard",
  disabled: "text-text-disabled",
}

type FileItemProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Inside a disabled Input File, the state is always "disabled". */
  state?: FileItemState
  fileName: React.ReactNode
  /** Second line: the progress, the type and size, or the error. */
  description?: React.ReactNode
  /** The text in the .Icon File Format tag. */
  format?: string
  /** Shows the Download button while Uploaded. */
  onDownload?: () => void
  /** Shows the remove button while Uploaded. */
  onRemove?: () => void
  /** Accessible name of the Download button. */
  downloadLabel?: string
  /** Accessible name of the remove button. */
  removeLabel?: string
}

function FileItem({
  state = "uploaded",
  fileName,
  description,
  format,
  onDownload,
  onRemove,
  downloadLabel = "Download",
  removeLabel = "Remove",
  className,
  ...props
}: FileItemProps) {
  const { disabled } = React.useContext(InputFileContext)
  const itemState = disabled ? "disabled" : state
  const isDisabled = itemState === "disabled"
  const showButtons = itemState === "uploaded" && (onDownload || onRemove)

  return (
    <div
      data-slot="file-item"
      data-state={itemState}
      className={cn(
        // 15px + the 1px border = the 16px padding in Figma, where the stroke
        // is Inside.
        "flex w-full items-center gap-4 rounded-md border bg-background-surface p-[15px]",
        isDisabled ? "border-border-disabled-soft" : "border-border-secondary",
        className
      )}
      {...props}
    >
      <IconFileFormat
        format={format}
        className={isDisabled ? "opacity-50" : undefined}
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <p
          className={cn(
            "truncate text-body-medium",
            isDisabled ? "text-text-disabled" : "text-text-primary"
          )}
        >
          {fileName}
        </p>
        {description && (
          <p
            className={cn(
              "truncate text-body-small",
              fileItemDescriptionColor[itemState]
            )}
          >
            {description}
          </p>
        )}
      </div>
      {showButtons && (
        <div className="flex shrink-0 items-center gap-2">
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label={downloadLabel}
              onClick={onDownload}
            >
              <HugeiconsIcon icon={DownloadIcon} />
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              danger
              aria-label={removeLabel}
              onClick={onRemove}
            >
              <HugeiconsIcon icon={TrashIcon} />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Dropped files skip the file picker's own `accept` filter.
function matchesAccept(file: File, accept?: string) {
  if (!accept) return true
  return accept.split(",").some((entry) => {
    const type = entry.trim().toLowerCase()
    if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type)
    if (type.endsWith("/*")) return file.type.startsWith(type.slice(0, -1))
    return file.type === type
  })
}

const uploadAreaActiveTextClassName =
  "group-hover/upload:text-text-accent-standard group-data-dragging/upload:text-text-accent-standard"

type InputFileProps = Pick<
  React.ComponentProps<"input">,
  "id" | "accept" | "multiple" | "disabled" | "ref" | "aria-invalid"
> &
  Pick<
    InputBaseProps,
    "label" | "requirement" | "info" | "helpText" | "error"
  > & {
    /** Classes for the root, around the label, Upload Area and File Item List. */
    className?: string
    /** First line of the Upload Area. */
    title?: React.ReactNode
    /** Second line of the Upload Area, usually the file limits. */
    description?: React.ReactNode
    /** Files picked or dropped that pass `accept` and `multiple`. */
    onFilesChange?: (files: File[]) => void
    /** Files dropped that don't pass `accept` or `multiple`. */
    onFilesRejected?: (files: File[]) => void
    /** The File Item List: one `FileItem` per file. */
    children?: React.ReactNode
  }

function InputFile({
  className,
  label,
  requirement,
  info,
  helpText,
  error,
  title = "Arraste e solte ou busque pelo arquivo",
  description,
  onFilesChange,
  onFilesRejected,
  children,
  id,
  accept,
  multiple,
  disabled,
  ref,
  "aria-invalid": ariaInvalid,
}: InputFileProps) {
  const base = useInputBase({ id, disabled, error, helpText, ariaInvalid })
  const [dragging, setDragging] = React.useState(false)
  const context = React.useMemo(
    () => ({ disabled: Boolean(disabled) }),
    [disabled]
  )
  // toArray skips empty children, like `{file && <FileItem />}`.
  const hasFileItems = React.Children.toArray(children).length > 0
  const showUploadArea = multiple || !hasFileItems

  const handleFiles = (list: FileList | null) => {
    const files = Array.from(list ?? [])
    const accepted = files
      .filter((file) => matchesAccept(file, accept))
      .slice(0, multiple ? undefined : 1)
    const rejected = files.filter((file) => !accepted.includes(file))
    if (accepted.length > 0) onFilesChange?.(accepted)
    if (rejected.length > 0) onFilesRejected?.(rejected)
  }

  return (
    <InputRoot
      data-slot="input-file"
      state={base.state}
      invalid={base.invalid}
      filled={false}
      // min-w-0: a long file name can't widen it inside a grid or flex parent.
      className={cn("min-w-0 gap-6", className)}
    >
      <div className="flex flex-col gap-4">
        <InputLabel
          state={base.state}
          htmlFor={base.inputId}
          label={label}
          requirement={requirement}
          info={info}
        />
        {showUploadArea && (
          <label
            data-slot="input-file-area"
            data-dragging={dragging || undefined}
            // The default is to open the dropped file, even while disabled.
            onDragOver={(event) => {
              event.preventDefault()
              if (disabled) event.dataTransfer.dropEffect = "none"
            }}
            onDragEnter={() => setDragging(!disabled)}
            onDragLeave={(event) => {
              const next = event.relatedTarget as Node | null
              if (!event.currentTarget.contains(next)) setDragging(false)
            }}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              if (!disabled) handleFiles(event.dataTransfer.files)
            }}
            className={cn(
              "group/upload flex w-full items-start gap-4 rounded-md border border-dashed border-border-primary p-[15px] transition-colors",
              "outline-offset-2 outline-border-accent-strong group-data-invalid/input:outline-border-danger-strong has-focus-visible:outline-3 has-focus-visible:outline-solid",
              disabled
                ? "cursor-not-allowed"
                : "cursor-pointer hover:border-border-accent-strong hover:bg-background-accent-hover data-dragging:border-border-accent-strong data-dragging:bg-background-accent-hover"
            )}
          >
            <input
              ref={ref}
              id={base.inputId}
              type="file"
              data-slot="input-file-input"
              accept={accept}
              multiple={multiple}
              disabled={disabled}
              aria-invalid={base.invalid || undefined}
              aria-describedby={base.messageId}
              onChange={(event) => {
                handleFiles(event.currentTarget.files)
                event.currentTarget.value = ""
              }}
              className="sr-only"
            />
            {/* Keeps the icon centered on the two lines of text. */}
            <span className="flex min-h-[49px] shrink-0 items-center">
              <IconColors
                container
                icon={UploadIcon}
                className={disabled ? "opacity-50" : undefined}
              />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span
                className={cn(
                  "text-label-medium transition-colors",
                  disabled
                    ? "text-text-disabled"
                    : cn("text-text-primary", uploadAreaActiveTextClassName)
                )}
              >
                {title}
              </span>
              {description && (
                <span
                  className={cn(
                    "text-body-small transition-colors",
                    disabled
                      ? "text-text-disabled"
                      : cn("text-text-secondary", uploadAreaActiveTextClassName)
                  )}
                >
                  {description}
                </span>
              )}
            </span>
          </label>
        )}
        <InputMessage id={base.messageId} error={Boolean(error)}>
          {base.message}
        </InputMessage>
      </div>
      {hasFileItems && (
        <InputFileContext.Provider value={context}>
          <div data-slot="input-file-list" className="flex flex-col gap-4">
            {children}
          </div>
        </InputFileContext.Provider>
      )}
    </InputRoot>
  )
}

export {
  DownloadIcon,
  FileItem,
  IconFileFormat,
  InputFile,
  TrashIcon,
  type FileItemProps,
  type FileItemState,
  type InputFileProps,
}

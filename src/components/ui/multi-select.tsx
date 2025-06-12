
import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface MultiSelectOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  onValueChange: (value: string[]) => void
  defaultValue?: string[]
  value?: string[]
  placeholder?: string
  animation?: number
  maxCount?: number
  modalPopover?: boolean
  asChild?: boolean
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options = [],
  onValueChange,
  value,
  defaultValue = [],
  placeholder = "Select items",
  animation = 0,
  maxCount = 3,
  modalPopover = false,
  asChild = false,
  className,
  disabled = false,
}: MultiSelectProps) {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    value || defaultValue || []
  )
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)

  // Ensure options is always an array with proper validation
  const safeOptions = React.useMemo(() => {
    if (!Array.isArray(options)) {
      console.warn('MultiSelect: options prop is not an array, defaulting to empty array');
      return [];
    }
    return options.filter(option => option && typeof option === 'object' && option.value && option.label);
  }, [options])

  // Ensure selectedValues is always an array with proper validation
  const safeSelectedValues = React.useMemo(() => {
    if (!Array.isArray(selectedValues)) {
      console.warn('MultiSelect: selectedValues is not an array, defaulting to empty array');
      return [];
    }
    return selectedValues.filter(value => typeof value === 'string' && value.length > 0);
  }, [selectedValues])

  React.useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedValues(value);
    }
  }, [value])

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsPopoverOpen(true)
    } else if (event.key === "Backspace" && !(event.target as HTMLInputElement).value) {
      const newSelectedValues = [...safeSelectedValues]
      newSelectedValues.pop()
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    }
  }

  const toggleOption = (option: string) => {
    if (!option || typeof option !== 'string') return;
    
    const newSelectedValues = safeSelectedValues.includes(option)
      ? safeSelectedValues.filter((value) => value !== option)
      : [...safeSelectedValues, option]
    setSelectedValues(newSelectedValues)
    onValueChange(newSelectedValues)
  }

  const handleClear = () => {
    setSelectedValues([])
    onValueChange([])
  }

  const handleTogglePopover = () => {
    setIsPopoverOpen((prev) => !prev)
  }

  const clearExtraOptions = () => {
    const newSelectedValues = safeSelectedValues.slice(0, maxCount)
    setSelectedValues(newSelectedValues)
    onValueChange(newSelectedValues)
  }

  const toggleAll = () => {
    if (safeSelectedValues.length === safeOptions.length) {
      handleClear()
    } else {
      const allValues = safeOptions.map((option) => option.value).filter(Boolean)
      setSelectedValues(allValues)
      onValueChange(allValues)
    }
  }

  // Early return if we don't have safe options to prevent Command component errors
  if (!safeOptions || safeOptions.length === 0) {
    return (
      <Button
        className={cn(
          "flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit",
          {
            "cursor-not-allowed opacity-50": disabled,
          },
          className
        )}
        disabled={true}
      >
        <span className="text-sm text-muted-foreground mx-3">
          No options available
        </span>
        <ChevronDown className="h-4 w-4 cursor-pointer text-muted-foreground mx-2" />
      </Button>
    )
  }

  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
      modal={modalPopover}
    >
      <PopoverTrigger asChild>
        <Button
          ref={null}
          {...{}}
          onClick={handleTogglePopover}
          className={cn(
            "flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit",
            {
              "cursor-not-allowed opacity-50": disabled,
            },
            className
          )}
          disabled={disabled}
        >
          <div className="flex justify-between items-center w-full mx-auto">
            <div className="flex flex-wrap items-center">
              {safeSelectedValues.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {safeSelectedValues.slice(0, maxCount).map((value) => {
                    const option = safeOptions.find((o) => o.value === value)
                    if (!option) return null;
                    const IconComponent = option?.icon
                    return (
                      <Badge
                        key={value}
                        className={cn(
                          isAnimating ? "animate-bounce" : "",
                          "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground",
                          "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground"
                        )}
                        data-fixed={undefined}
                        data-disabled={disabled}
                      >
                        {IconComponent && (
                          <IconComponent className="h-4 w-4 mr-2" />
                        )}
                        {option?.label}
                        <button
                          className={cn(
                            "ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            (disabled) && "hidden",
                          )}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleInputKeyDown(e as any)
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleOption(value)
                          }}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </Badge>
                    )
                  })}
                  {safeSelectedValues.length > maxCount && (
                    <Badge
                      className={cn(
                        "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                        isAnimating ? "animate-bounce" : "",
                        disabled &&
                          "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground"
                      )}
                      data-disabled={disabled}
                    >
                      {`+ ${safeSelectedValues.length - maxCount} more`}
                      <button
                        className={cn(
                          "ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                          disabled && "hidden",
                        )}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleInputKeyDown(e as any)
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          clearExtraOptions()
                        }}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between w-full mx-auto">
                  <span className="text-sm text-muted-foreground mx-3">
                    {placeholder}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              {safeSelectedValues.length > 0 && (
                <div className="flex items-center">
                  <button
                    className={cn(
                      "ml-2 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      disabled && "hidden",
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleInputKeyDown(e as any)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleClear()
                    }}
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              )}
              <ChevronDown className="h-4 w-4 cursor-pointer text-muted-foreground mx-2" />
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-popover border shadow-md z-[10000]"
        align="start"
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
        style={{ zIndex: 10000 }}
      >
        <Command 
          className="bg-popover" 
          shouldFilter={false}
          key={`command-${safeOptions.length}-${safeSelectedValues.length}`}
        >
          <CommandInput
            placeholder="Search..."
            onKeyDown={handleInputKeyDown}
            className="bg-popover"
          />
          <CommandEmpty className="bg-popover">No results found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto bg-popover">
            <CommandItem
              key="all"
              onSelect={toggleAll}
              className="cursor-pointer bg-popover hover:bg-accent hover:text-accent-foreground"
            >
              <div
                className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  safeSelectedValues.length === safeOptions.length
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50 [&_svg]:invisible"
                )}
              >
                <Check className={cn("h-4 w-4")} />
              </div>
              <span>(Select All)</span>
            </CommandItem>
            {safeOptions.map((option) => {
              if (!option || !option.value) return null;
              const isSelected = safeSelectedValues.includes(option.value)
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => toggleOption(option.value)}
                  className="cursor-pointer bg-popover hover:bg-accent hover:text-accent-foreground"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  {option.icon && (
                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{option.label}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface SimpleMultiSelectOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface SimpleMultiSelectProps {
  options: SimpleMultiSelectOption[]
  onValueChange: (value: string[]) => void
  defaultValue?: string[]
  value?: string[]
  placeholder?: string
  maxCount?: number
  className?: string
  disabled?: boolean
}

export function SimpleMultiSelect({
  options = [],
  onValueChange,
  value,
  defaultValue = [],
  placeholder = "Select items",
  maxCount = 3,
  className,
  disabled = false,
}: SimpleMultiSelectProps) {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    value || defaultValue || []
  )
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  // Ensure options is always a valid array
  const safeOptions = React.useMemo(() => {
    if (!Array.isArray(options)) {
      return [];
    }
    return options.filter(option => 
      option && 
      typeof option === 'object' && 
      typeof option.value === 'string' && 
      option.value.length > 0 &&
      typeof option.label === 'string' && 
      option.label.length > 0
    );
  }, [options])

  // Ensure selectedValues is always a valid array
  const safeSelectedValues = React.useMemo(() => {
    if (!Array.isArray(selectedValues)) {
      return [];
    }
    return selectedValues.filter(value => 
      typeof value === 'string' && 
      value.length > 0 &&
      safeOptions.some(option => option.value === value)
    );
  }, [selectedValues, safeOptions])

  React.useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedValues(value);
    }
  }, [value])

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return safeOptions;
    return safeOptions.filter(option =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [safeOptions, searchValue])

  const toggleOption = (optionValue: string) => {
    if (!optionValue || typeof optionValue !== 'string') return;
    
    const newSelectedValues = safeSelectedValues.includes(optionValue)
      ? safeSelectedValues.filter((value) => value !== optionValue)
      : [...safeSelectedValues, optionValue]
    
    setSelectedValues(newSelectedValues)
    onValueChange(newSelectedValues)
  }

  const handleClear = () => {
    setSelectedValues([])
    onValueChange([])
  }

  const toggleAll = () => {
    if (safeSelectedValues.length === safeOptions.length) {
      handleClear()
    } else {
      const allValues = safeOptions.map((option) => option.value)
      setSelectedValues(allValues)
      onValueChange(allValues)
    }
  }

  const clearExtraOptions = () => {
    const newSelectedValues = safeSelectedValues.slice(0, maxCount)
    setSelectedValues(newSelectedValues)
    onValueChange(newSelectedValues)
  }

  // Early return if we don't have safe options
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
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
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
                          "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground"
                        )}
                        data-disabled={disabled}
                      >
                        {IconComponent && (
                          <IconComponent className="h-4 w-4 mr-2" />
                        )}
                        {option?.label}
                        <button
                          className={cn(
                            "ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            disabled && "hidden",
                          )}
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
        style={{ zIndex: 10000 }}
      >
        <div className="bg-popover">
          {/* Search Input */}
          <div className="flex items-center border-b px-3">
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            />
          </div>

          <ScrollArea className="max-h-64">
            <div className="p-1">
              {/* Select All Option */}
              <div
                className="cursor-pointer bg-popover hover:bg-accent hover:text-accent-foreground flex items-center px-2 py-1.5 text-sm rounded-sm"
                onClick={toggleAll}
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    safeSelectedValues.length === safeOptions.length
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50"
                  )}
                >
                  {safeSelectedValues.length === safeOptions.length && (
                    <Check className="h-4 w-4" />
                  )}
                </div>
                <span>(Select All)</span>
              </div>

              {/* Options */}
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm">No results found.</div>
              ) : (
                filteredOptions.map((option) => {
                  if (!option || !option.value) return null;
                  const isSelected = safeSelectedValues.includes(option.value)
                  return (
                    <div
                      key={option.value}
                      className="cursor-pointer bg-popover hover:bg-accent hover:text-accent-foreground flex items-center px-2 py-1.5 text-sm rounded-sm"
                      onClick={() => toggleOption(option.value)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50"
                        )}
                      >
                        {isSelected && <Check className="h-4 w-4" />}
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}

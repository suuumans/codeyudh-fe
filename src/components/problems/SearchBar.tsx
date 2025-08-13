import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    debounceMs?: number
}

export function SearchBar({ 
    value, 
    onChange, 
    placeholder = "Search problems...", 
    debounceMs = 300 
}: SearchBarProps) {
    const [localValue, setLocalValue] = useState(value)

    // Debounce the search input
    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(localValue)
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [localValue, onChange, debounceMs])

    // Update local value when external value changes
    useEffect(() => {
        setLocalValue(value)
    }, [value])

    const handleClear = () => {
        setLocalValue('')
        onChange('')
    }

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder={placeholder}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="pl-10 pr-10"
            />
            {localValue && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                >
                    <X className="h-3 w-3" />
                </Button>
            )}
        </div>
    )
}
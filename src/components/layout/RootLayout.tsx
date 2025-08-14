import { useMobileMenu } from '@/hooks/useUIStore'
import { Link } from '@tanstack/react-router'
import { Menu, Code, User, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth, useLogout } from '@/hooks/useAuth'
import { ThemeToggle } from '@/components/theme'
import { useGlobalErrorHandler } from '@/hooks/useGlobalErrorHandler'

interface RootLayoutProps {
    children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
    const { user, isAuthenticated } = useAuth()
    const logout = useLogout()
    const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu, close: closeMobileMenu } = useMobileMenu()
    
    // Initialize global error handling
    useGlobalErrorHandler()

    const navigationItems = [
        { to: '/', label: 'Home' },
        { to: '/problems', label: 'Problems' },
    ]

    const authenticatedNavigationItems = [
        ...navigationItems,
        { to: '/dashboard', label: 'Dashboard' },
    ]

    const currentNavItems = isAuthenticated ? authenticatedNavigationItems : navigationItems

    const handleLogout = () => {
        logout()
        closeMobileMenu()
    }

    const getUserInitials = (username: string) => {
        return username
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <Code className="h-6 w-6" />
                        <span className="font-bold text-xl">CodeYudh</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {currentNavItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} alt={user.username} />
                                            <AvatarFallback>
                                                {getUserInitials(user.username)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            <p className="font-medium">{user.username}</p>
                                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to={"/profile" as any} className="flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to={"/settings" as any} className="flex items-center">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" asChild>
                                    <Link to={"/login" as any}>Sign In</Link>
                                </Button>
                                <Button asChild>
                                    <Link to={"/register" as any}>Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet open={isMobileMenuOpen} onOpenChange={(open) => open ? toggleMobileMenu() : closeMobileMenu()}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                className="md:hidden"
                                size="icon"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col h-full">
                                {/* Mobile Header */}
                                <div className="flex items-center justify-between pb-4">
                                    <Link
                                        to="/"
                                        className="flex items-center space-x-2"
                                        onClick={closeMobileMenu}
                                    >
                                        <Code className="h-6 w-6" />
                                        <span className="font-bold text-xl">CodeYudh</span>
                                    </Link>
                                </div>

                                {/* Mobile Navigation */}
                                <nav className="flex flex-col space-y-4 flex-1">
                                    {currentNavItems.map((item) => (
                                        <Link
                                            key={item.to}
                                            to={item.to}
                                            className="text-lg font-medium transition-colors hover:text-primary [&.active]:text-primary"
                                            onClick={closeMobileMenu}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>

                                {/* Mobile Auth Section */}
                                <div className="pt-4 border-t">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium">Theme</span>
                                        <ThemeToggle />
                                    </div>
                                    {isAuthenticated && user ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={user.avatar} alt={user.username} />
                                                    <AvatarFallback>
                                                        {getUserInitials(user.username)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="font-medium">{user.username}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <Button
                                                    variant="ghost"
                                                    className="justify-start"
                                                    asChild
                                                >
                                                    <Link
                                                        to={"/profile" as any}
                                                        onClick={closeMobileMenu}
                                                    >
                                                        <User className="mr-2 h-4 w-4" />
                                                        Profile
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="justify-start"
                                                    asChild
                                                >
                                                    <Link
                                                        to={"/settings" as any}
                                                        onClick={closeMobileMenu}
                                                    >
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        Settings
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="justify-start"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Log out
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col space-y-2">
                                            <Button
                                                variant="ghost"
                                                asChild
                                                className="justify-start"
                                            >
                                                <Link
                                                    to={"/login" as any}
                                                    onClick={closeMobileMenu}
                                                >
                                                    Sign In
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                className="justify-start"
                                            >
                                                <Link
                                                    to="/register"
                                                    onClick={closeMobileMenu}
                                                >
                                                    Sign Up
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
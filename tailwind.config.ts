import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
		fontFamily: {
			sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
			display: ['Inter', 'sans-serif'],
			mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
		},
		fontSize: {
			'xs': ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '-0.01em' }],
			'sm': ['0.9375rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
			'base': ['1.0625rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
			'lg': ['1.1875rem', { lineHeight: '1.875rem', letterSpacing: '-0.02em' }],
			'xl': ['1.375rem', { lineHeight: '2rem', letterSpacing: '-0.03em' }],
			'2xl': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.03em' }],
			'3xl': ['2.125rem', { lineHeight: '2.5rem', letterSpacing: '-0.04em' }],
			'4xl': ['2.75rem', { lineHeight: '3rem', letterSpacing: '-0.04em' }],
			'5xl': ['3.5rem', { lineHeight: '3.75rem', letterSpacing: '-0.05em' }],
			'6xl': ['4.5rem', { lineHeight: '4.75rem', letterSpacing: '-0.05em' }],
			'7xl': ['5.5rem', { lineHeight: '5.75rem', letterSpacing: '-0.06em' }],
			'8xl': ['7rem', { lineHeight: '7.25rem', letterSpacing: '-0.06em' }],
		},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
					glow: 'hsl(var(--success-glow))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				// Custom vibrant colors
				'electric-blue': 'hsl(var(--electric-blue))',
				'vibrant-green': 'hsl(var(--vibrant-green))',
				'sunset-orange': 'hsl(var(--sunset-orange))',
				'royal-purple': 'hsl(var(--royal-purple))',
				'coral-pink': 'hsl(var(--coral-pink))',
				'golden-yellow': 'hsl(var(--golden-yellow))',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-electric': 'var(--gradient-electric)',
				'gradient-vibrant': 'var(--gradient-vibrant)',
				'gradient-sunset': 'var(--gradient-sunset)',
			},
			boxShadow: {
				'elegant': 'var(--shadow-elegant)',
				'glow': 'var(--shadow-glow)',
				'card': 'var(--shadow-card)',
				'colorful': 'var(--shadow-colorful)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(var(--primary) / 0.3)'
					},
					'50%': {
						boxShadow: '0 0 40px hsl(var(--primary) / 0.6)'
					}
				},
				'bounce-gentle': {
					'0%, 100%': {
						transform: 'translateY(0)',
					},
					'50%': {
						transform: 'translateY(-5px)',
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)',
					},
					'33%': {
						transform: 'translateY(-10px) rotate(-3deg)',
					},
					'66%': {
						transform: 'translateY(5px) rotate(3deg)',
					}
				},
				'shimmer-text': {
					'0%': {
						backgroundPosition: '0% 50%',
					},
					'50%': {
						backgroundPosition: '100% 50%',
					},
					'100%': {
						backgroundPosition: '0% 50%',
					}
				},
				'gradient-x': {
					'0%, 100%': {
						backgroundPosition: '0% 50%',
					},
					'50%': {
						backgroundPosition: '100% 50%',
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'bounce-gentle': 'bounce-gentle 1s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'shimmer-text': 'shimmer-text 3s ease-in-out infinite',
				'spin-slow': 'spin 3s linear infinite',
				'gradient-x': 'gradient-x 3s ease infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

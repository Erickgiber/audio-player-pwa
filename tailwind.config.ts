import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: 'var(--primary)',
				'primary-dark': 'var(--primary-dark)',
				'primary-light': 'var(--primary-light)',
				accent: 'var(--accent)',
				'accent-dark': 'var(--accent-dark)',
				background: 'var(--background)',
				surface: 'var(--surface)',
				'surface-alt': 'var(--surface-alt)',
				foreground: 'var(--foreground)',
				muted: 'var(--muted)',
				'muted-foreground': 'var(--muted-foreground)',
				border: 'var(--border)',
				success: 'var(--success)',
				warning: 'var(--warning)',
				error: 'var(--error)'
			},
			backgroundColor: {
				primary: 'var(--primary)',
				'primary-dark': 'var(--primary-dark)',
				surface: 'var(--surface)',
				'surface-alt': 'var(--surface-alt)'
			},
			borderColor: {
				primary: 'var(--primary)',
				DEFAULT: 'var(--border)'
			},
			textColor: {
				primary: 'var(--primary)',
				muted: 'var(--muted-foreground)'
			},
			borderRadius: {
				DEFAULT: 'var(--radius)',
				lg: 'var(--radius-lg)'
			},
			animation: {
				'spin-slow': 'spin 4s linear infinite',
				'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'fade-in': 'fadeIn 0.3s ease-in-out',
				'slide-in-up': 'slideInUp 0.3s ease-out'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideInUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				}
			},
			spacing: {
				safe: 'max(1rem, env(safe-area-inset-bottom))'
			}
		}
	},
	plugins: []
};

export default config;

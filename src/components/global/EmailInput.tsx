'use client';

import React from 'react';
import { useState, useRef, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailInputProps {
	value: string[];
	onChange: (emails: string[]) => void;
	placeholder?: string;
	className?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({
	value = [],
	onChange,
	placeholder = 'Enter email addresses...',
	className,
}) => {
	const [inputValue, setInputValue] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email.trim());
	};

	const addEmail = (email: string) => {
		const trimmedEmail = email.trim();
		if (trimmedEmail && !value.includes(trimmedEmail)) {
			onChange([...value, trimmedEmail]);
		}
		setInputValue('');
	};

	const removeEmail = (indexToRemove: number) => {
		onChange(value.filter((_, index) => index !== indexToRemove));
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		const { key } = e;

		if (['Enter', ' ', ','].includes(key)) {
			e.preventDefault();
			if (inputValue.trim()) {
				// Handle multiple emails separated by commas
				const emails = inputValue
					.split(',')
					.map((email) => email.trim())
					.filter(Boolean);
				emails.forEach((email) => addEmail(email));
			}
		} else if (key === 'Backspace' && !inputValue && value.length > 0) {
			// Remove last email when backspace is pressed and input is empty
			removeEmail(value.length - 1);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;

		// Check if user pasted multiple emails
		if (newValue.includes(',')) {
			const emails = newValue
				.split(',')
				.map((email) => email.trim())
				.filter(Boolean);
			emails.forEach((email) => addEmail(email));
			setInputValue('');
		} else {
			setInputValue(newValue);
		}
	};

	const handleContainerClick = () => {
		inputRef.current?.focus();
	};

	return (
		<div
			className={cn(
				'border-input bg-background ring-offset-background flex flex-wrap gap-2 rounded-md border p-3 text-sm',
				'focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2',
				'max-h-[300px] min-h-[40px] cursor-text overflow-y-auto',

				className
			)}
			onClick={handleContainerClick}
		>
			{value.map((email, index) => {
				const isValid = isValidEmail(email);
				return (
					<div
						key={index}
						className={cn(
							'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
							'border transition-colors',
							isValid
								? 'text-primary border-primary/20 bg-primary/5 hover:bg-primary/10'
								: 'text-destructive border-destructive/20 bg-destructive/5 hover:bg-destructive/10 border-dashed'
						)}
					>
						<span>{email}</span>
						<button
							type='button'
							onClick={(e) => {
								e.stopPropagation();
								removeEmail(index);
							}}
							className={cn('bg-opacity-20 ml-1 rounded-full p-0.5', 'ring-1 ring-current outline-none')}
						>
							<X className='h-3 w-3' />
						</button>
					</div>
				);
			})}

			<input
				ref={inputRef}
				type='text'
				value={inputValue}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				placeholder={value.length === 0 ? placeholder : ''}
				className='placeholder:text-muted-foreground min-w-[120px] flex-1 border-none bg-transparent outline-none'
			/>
		</div>
	);
};

export default EmailInput;

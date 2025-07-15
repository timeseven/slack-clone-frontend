'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface DeltaOp {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	insert?: string | { image?: string; [key: string]: any };
	attributes?: {
		bold?: boolean;
		italic?: boolean;
		underline?: boolean;
		strike?: boolean;
		code?: boolean;
		link?: string;
		color?: string;
		background?: string;
		size?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	};
	retain?: number;
	delete?: number;
}

interface QuillDelta {
	ops: DeltaOp[];
}

interface DeltaRendererProps {
	delta: QuillDelta | string;
	className?: string;
}

const DeltaRenderer = ({ delta, className }: DeltaRendererProps) => {
	// Handle case where delta might be a string (fallback)
	if (typeof delta === 'string') {
		return <div className={className}>{delta}</div>;
	}

	// Handle case where delta is null/undefined
	if (!delta || !delta.ops) {
		return <div className={className}></div>;
	}

	const renderOp = (op: DeltaOp, index: number) => {
		if (!op.insert) return null;

		// Handle image inserts
		if (typeof op.insert === 'object' && op.insert.image) {
			return (
				<div key={index} className='relative my-1'>
					<Image
						src={op.insert.image || '/placeholder.svg'}
						alt='Embedded image'
						width={400}
						height={300}
						className='h-auto max-w-full rounded-md object-cover'
						unoptimized={op.insert.image?.startsWith('data:') || false}
					/>
				</div>
			);
		}

		// Handle text inserts
		if (typeof op.insert === 'string') {
			let content: React.ReactNode = op.insert;

			// Handle line breaks
			if (op.insert.includes('\n')) {
				content = op.insert.split('\n').map((line, i, arr) => (
					<React.Fragment key={i}>
						{line}
						{i < arr.length - 1 && <br />}
					</React.Fragment>
				));
			}

			// Apply text formatting based on attributes
			if (op.attributes) {
				const attrs = op.attributes;
				const styles: React.CSSProperties = {};
				let classes = '';

				// Apply inline styles
				if (attrs.color) styles.color = attrs.color;
				if (attrs.background) styles.backgroundColor = attrs.background;

				// Apply text formatting classes
				if (attrs.bold) classes += ' font-bold';
				if (attrs.italic) classes += ' italic';
				if (attrs.underline) classes += ' underline';
				if (attrs.strike) classes += ' line-through';
				if (attrs.code) classes += ' bg-muted px-1 py-0.5 rounded text-sm font-mono';

				// Handle links
				if (attrs.link) {
					return (
						<a
							key={index}
							href={attrs.link}
							target='_blank'
							rel='noopener noreferrer'
							className={cn('text-blue-600 underline hover:text-blue-800', classes)}
							style={styles}
						>
							{content}
						</a>
					);
				}

				// Handle code blocks
				if (attrs.code) {
					return (
						<code key={index} className={cn('bg-muted rounded px-1 py-0.5 font-mono text-sm', classes)} style={styles}>
							{content}
						</code>
					);
				}

				// Regular formatted text
				return (
					<span key={index} className={cn(classes)} style={styles}>
						{content}
					</span>
				);
			}

			// Plain text without formatting
			return <span key={index}>{content}</span>;
		}

		return null;
	};

	return (
		<div className={cn('text-sm leading-[25px] break-words', className)}>
			{delta.ops.map((op, index) => renderOp(op, index))}
		</div>
	);
};

export default DeltaRenderer;

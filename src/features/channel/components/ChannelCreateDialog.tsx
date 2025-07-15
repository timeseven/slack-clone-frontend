'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Plus, ArrowLeft, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';
import { queryClient } from '@/context/ReactQueryContext';
import { useCreateChannel } from '@/features/channel/hooks/useChannelApiHooks';

const formSchema = z.object({
	name: z.string().trim().min(2, {
		message: 'Channel name must be at least 2 characters.',
	}),
	visibility: z.enum(['public', 'private']),
	template: z.string(),
});

type FormValues = z.infer<typeof formSchema>;
type Step = 'selection' | 'details';

const ChannelCreateDialog = () => {
	const [open, setOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('none');
	const [currentStep, setCurrentStep] = useState<Step>('selection');
	const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
	const createChannel = useCreateChannel();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			visibility: 'public',
			template: 'none',
		},
	});

	const onSubmit = async (values: FormValues) => {
		try {
			await createChannel.mutateAsync({
				workspaceId: currentWorkspaceId!,
				data: {
					name: values.name,
					type: 'channel',
					is_private: values.visibility === 'private',
					template: values.template,
				},
			});

			// Handle form submission
			setOpen(false);
			// Reset form and step when dialog closes
			form.reset();
			setCurrentStep('selection');
			setActiveTab('none');

			// invalidate channels query
			queryClient.invalidateQueries({ queryKey: ['channels', currentWorkspaceId] });
		} catch (error) {
			console.log('Failed to create channel:', error);
		}
	};

	const handleNext = () => {
		// Set the channel type in form when moving to next step
		form.setValue('template', activeTab);
		setCurrentStep('details');
	};

	const handleBack = () => {
		setCurrentStep('selection');
	};

	const handleDialogChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			// Reset everything when dialog closes
			form.reset();
			setCurrentStep('selection');
			setActiveTab('none');
		}
	};

	const tabs = [
		{
			label: 'Blank Template',
			value: 'none',
			description: 'Start with a clean slate',
		},
		{
			label: 'Event Planning Template',
			value: 'event',
			description: 'Organize events and manage timelines',
		},
		{
			label: 'Construction Template',
			value: 'construction',
			description: 'Manage construction phases and resources',
		},
		{
			label: 'Research Template',
			value: 'research',
			description: 'Track research progress and findings',
		},
		{
			label: 'Agile Scrum Template',
			value: 'agile',
			description: 'Sprint-based development workflow',
		},
		{
			label: 'Software Development Template',
			value: 'software',
			description: 'Full software development lifecycle',
		},
		{
			label: 'Traditional Waterfall Template',
			value: 'waterfall',
			description: 'Sequential project phases',
		},
	];

	const selectedTab = tabs.find((tab) => tab.value === activeTab);

	return (
		<Dialog open={open} onOpenChange={handleDialogChange}>
			<DialogTrigger asChild>
				<Button variant='ghost' size='sm' className='flex w-full items-center justify-start gap-2'>
					<Plus className='h-4 w-4 rounded-sm' />
					New Channel
				</Button>
			</DialogTrigger>
			<DialogContent className='border-none p-0 sm:max-w-4xl'>
				<DialogHeader className='sr-only'>
					<DialogTitle>Create Channel</DialogTitle>
				</DialogHeader>

				<div className='flex h-[600px] w-full'>
					{/* Left Panel */}
					<div className='bg-muted/30 flex basis-1/3 flex-col rounded-l-lg p-6'>
						{currentStep === 'details' && (
							<Button
								variant='ghost'
								size='sm'
								onClick={handleBack}
								className='hover:bg-background/80 mb-4 self-start px-2'
							>
								<ArrowLeft className='mr-1 h-4 w-4' />
								Back
							</Button>
						)}

						{currentStep === 'selection' ? (
							<>
								<div className='mb-4 text-lg font-semibold'>Create a channel</div>
								<div className='mb-6 flex flex-1 flex-col gap-2'>
									{tabs.map((tab) => (
										<button
											key={tab.value}
											className={`hover:bg-primary/10 flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
												activeTab === tab.value
													? 'bg-primary/15 text-primary font-medium'
													: 'text-muted-foreground hover:text-foreground'
											}`}
											onClick={() => setActiveTab(tab.value)}
										>
											{tab.label}
										</button>
									))}
								</div>
								<Button onClick={handleNext} disabled={!activeTab}>
									Next
								</Button>
							</>
						) : (
							<>
								<div className='mb-6 text-lg font-semibold'>Channel Details</div>
								<Form {...form}>
									<form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-1 flex-col space-y-6'>
										<FormField
											control={form.control}
											name='name'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Channel Name</FormLabel>
													<FormControl>
														<Input placeholder='Enter channel name' {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='visibility'
											render={({ field }) => (
												<FormItem className='space-y-3'>
													<FormLabel>Visibility</FormLabel>
													<FormControl>
														<RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='space-y-3'>
															<div className='hover:bg-background/50 flex items-center space-x-3 rounded-lg border p-3 transition-colors'>
																<RadioGroupItem value='public' id='public' />
																<div className='flex flex-1 items-center gap-2'>
																	<Globe className='text-muted-foreground size-4' />
																	<div>
																		<label htmlFor='public' className='cursor-pointer text-sm font-medium'>
																			Public
																		</label>
																		<p className='text-muted-foreground text-xs'>Anyone can view and contribute</p>
																	</div>
																</div>
															</div>
															<div className='hover:bg-background/50 flex items-center space-x-3 rounded-lg border p-3 transition-colors'>
																<RadioGroupItem value='private' id='private' />
																<div className='flex flex-1 items-center gap-2'>
																	<Lock className='text-muted-foreground size-4' />
																	<div>
																		<label htmlFor='private' className='cursor-pointer text-sm font-medium'>
																			Private
																		</label>
																		<p className='text-muted-foreground text-xs'>
																			Only you and invited members can access
																		</p>
																	</div>
																</div>
															</div>
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Button type='submit' className='mt-auto'>
											Create Channel
										</Button>
									</form>
								</Form>
							</>
						)}
					</div>

					{/* Right Panel */}
					<div className='bg-primary/5 flex flex-1 flex-col rounded-r-lg p-6'>
						<div className='mb-4 text-lg font-semibold'>
							{currentStep === 'selection'
								? selectedTab?.label || 'Select a channel type'
								: `Creating: ${selectedTab?.label}`}
						</div>

						{currentStep === 'selection' ? (
							<div className='text-muted-foreground flex flex-1 items-center justify-center'>
								<div className='space-y-2 text-center'>
									<div className='text-sm'>{selectedTab?.description || 'Choose a channel type to get started'}</div>
								</div>
							</div>
						) : (
							<div className='space-y-4'>
								<div className='bg-background rounded-lg border p-4'>
									<div className='mb-3 font-medium'>Channel Summary</div>
									<div className='text-muted-foreground space-y-2 text-sm'>
										<div>
											Template: <span className='text-foreground'>{selectedTab?.label}</span>
										</div>
										<div>
											Name: <span className='text-foreground'>{form.watch('name') || 'Not specified'}</span>
										</div>
										<div className='flex items-center gap-1'>
											Visibility:
											<span className='text-foreground ml-1 flex items-center gap-1'>
												{form.watch('visibility') === 'private' ? (
													<>
														<Lock className='h-3 w-3' />
														Private
													</>
												) : (
													<>
														<Globe className='h-3 w-3' />
														Public
													</>
												)}
											</span>
										</div>
									</div>
								</div>

								{selectedTab?.description && (
									<div className='bg-muted/50 rounded-lg border p-4'>
										<div className='mb-2 font-medium'>About this template</div>
										<div className='text-muted-foreground text-sm'>{selectedTab.description}</div>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ChannelCreateDialog;

'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Loading from '@/components/svg/Loading';
import { Button } from '@/components/ui/button';
import EmailInput from '@/components/global/EmailInput';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { WorkspaceRead } from '@/types/workspace';
import { useInviteToWorkspace } from '@/features/workspace/hooks/useWorkspaceApiHooks';

const formSchema = z.object({
	emails: z.array(z.string().email()).min(1, { message: 'At least one email is required.' }),
});

type FormValues = z.infer<typeof formSchema>;

const InviteMemberDialog = ({
	workspace,
	dialogOpen,
	setDialogOpen,
}: {
	workspace: WorkspaceRead | undefined;
	dialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
}) => {
	const inviteToWorkspace = useInviteToWorkspace();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			emails: [],
		},
	});

	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email.trim());
	};

	const hasInvalidEmails = (emails: string[]): boolean => {
		return emails.some((email) => !isValidEmail(email));
	};

	const onSubmit = async (values: FormValues) => {
		try {
			// Call mutation to invite users to workspace
			await inviteToWorkspace.mutateAsync({
				workspaceId: workspace?.id || '',
				data: values,
			});

			// On success, show success toast and close modal/dialog
			toast.success(`Invitations sent to ${values.emails.length} email(s)`);
			setDialogOpen(false);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			// On error, show error toast with message
			toast.error(`An unexpected error occurred: ${error.message || error}`);
		}
	};

	const isSubmitting = form.formState.isSubmitting || inviteToWorkspace.status === 'pending';
	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent className='border-none bg-transparent p-0 sm:max-w-lg'>
				<DialogHeader className='sr-only'>
					<DialogTitle>Invite people to {workspace?.name}</DialogTitle>
					<DialogDescription>Add emails to invite to your workspace</DialogDescription>
				</DialogHeader>
				<Card>
					<CardHeader>
						<CardTitle className='text-2xl'>{`Invite people to ${workspace?.name || 'Workspace'}`}</CardTitle>
						<CardDescription>Enter email addresses to invite people to your workspace</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
								<FormField
									control={form.control}
									name='emails'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Emails:</FormLabel>
											<FormControl>
												<EmailInput value={field.value} onChange={field.onChange} />
											</FormControl>
											<div className='text-muted-foreground mt-2 text-xs'>
												Press Enter, Space, or Comma to add emails. Use Backspace or X to remove the last email.
											</div>
											<FormMessage />
											{hasInvalidEmails(form.watch('emails')) && (
												<div className='text-destructive mt-1 text-xs'>
													Please fix invalid email addresses before sending invitations.
												</div>
											)}
										</FormItem>
									)}
								/>

								<Button
									type='submit'
									className='w-full'
									disabled={isSubmitting || form.watch('emails').length === 0 || hasInvalidEmails(form.watch('emails'))}
								>
									{isSubmitting ? <Loading size='sm' /> : `Send Invitations (${form.watch('emails').length})`}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</DialogContent>
		</Dialog>
	);
};

export default InviteMemberDialog;

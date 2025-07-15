import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';

const ForgotPasswordPage = () => {
	return (
		<div className='flex h-full items-center justify-center p-2'>
			<ForgotPasswordForm className='w-full max-w-sm' />
		</div>
	);
};

export default ForgotPasswordPage;

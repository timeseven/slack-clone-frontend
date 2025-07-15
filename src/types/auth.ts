export interface SignupProps {
	email: string;
	full_name: string;
	password: string;
}

export interface SigninProps {
	email: string;
	password: string;
}

export interface ForgotPasswordProps {
	email: string;
}

export interface ResetPasswordProps {
	password: string;
	token: string;
}

export interface ChangePasswordProps {
	old_password: string;
	new_password: string;
}

export interface VerifyEmailProps {
	token: string;
}

export interface RequestVerifyEmailProps {
	email: string;
}

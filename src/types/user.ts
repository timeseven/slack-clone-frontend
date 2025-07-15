export interface UpdateUserMe {
	full_name?: string;
	avatar?: File | null;
	status?: string | null;
}

export interface UserRead {
	id: string;
	email: string;
	full_name: string;
	avatar: string | null;
	status: string | null;
	is_active: boolean;
	is_verified: boolean;
	last_login_at: Date | null;
	created_at: Date;
	updated_at: Date;
}

export interface UserBaseRead {
	id: string;
	full_name: string;
	email: string;
	avatar: string | null;
}

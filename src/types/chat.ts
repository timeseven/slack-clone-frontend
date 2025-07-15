export interface Message {
	id: string;
	body: string;
	file?: File;
	memberId: string;
	workspaceId: string;
	projectId?: string;
	parentMessageId?: string;
	conversationId?: string;
}

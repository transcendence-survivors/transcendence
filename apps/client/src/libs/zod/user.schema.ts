import { z } from 'zod';

enum ERROR_KEYS {
	ERR_EMPTY = 'ERR_EMPTY',
	ERR_MIN_LENGTH = 'ERR_MIN_LENGTH',
	ERR_MAX_LENGTH = 'ERR_MAX_LENGTH',
	ERR_IS_STRING = 'ERR_IS_STRING',
	ERR_IS_DATE = 'ERR_IS_DATE',
	ERR_IS_EMAIL = 'ERR_IS_EMAIL',
	ERR_UNDEFINED = 'ERR_UNDEFINED',
}

export enum UserRole {
	USER = 'USER',
	ADMIN = 'ADMIN',
	SUPER_ADMIN = 'SUPER_ADMIN',
}

const userIdSchema = z.uuid({ message: ERROR_KEYS.ERR_IS_STRING });

const userEmailSchema = z.email({ message: ERROR_KEYS.ERR_IS_EMAIL });
const userNameSchema = z
	.string()
	.min(3, { message: ERROR_KEYS.ERR_MIN_LENGTH })
	.max(20, { message: ERROR_KEYS.ERR_MAX_LENGTH });

const userDisplayNameSchema = z
	.string({ message: ERROR_KEYS.ERR_IS_STRING })
	.min(3, { message: ERROR_KEYS.ERR_MIN_LENGTH })
	.max(50, { message: ERROR_KEYS.ERR_MAX_LENGTH });

const userFirstNameSchema = z
	.string({ message: ERROR_KEYS.ERR_IS_STRING })
	.min(3, { message: ERROR_KEYS.ERR_MIN_LENGTH })
	.max(50, { message: ERROR_KEYS.ERR_MAX_LENGTH });

const userLastNameSchema = z
	.string({ message: ERROR_KEYS.ERR_IS_STRING })
	.min(3, { message: ERROR_KEYS.ERR_MIN_LENGTH })
	.max(50, { message: ERROR_KEYS.ERR_MAX_LENGTH });

const userPasswordSchema = z
	.string({ message: ERROR_KEYS.ERR_IS_STRING })
	.min(6, { message: ERROR_KEYS.ERR_MIN_LENGTH })
	.max(100, { message: ERROR_KEYS.ERR_MAX_LENGTH });

const userRole = z.enum(UserRole, { message: ERROR_KEYS.ERR_IS_STRING });

const userBirthdaySchema = z.date({ message: ERROR_KEYS.ERR_IS_DATE });

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export const userCreateSchema = z.object({
	email: userEmailSchema,
	username: userNameSchema,
	displayName: userDisplayNameSchema,
	firstName: userFirstNameSchema,
	lastName: userLastNameSchema,
	birthday: userBirthdaySchema,
	password: userPasswordSchema,
	confirmPassword: userPasswordSchema,
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;
export const userLoginSchema = z.object({
	email: userEmailSchema,
	password: userPasswordSchema,
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export const userUpdateSchema = z.object({
	email: userEmailSchema.optional(),
	username: userNameSchema.optional(),
	displayName: userDisplayNameSchema.optional(),
	firstName: userFirstNameSchema.optional(),
	lastName: userLastNameSchema.optional(),
});

export type User = z.infer<typeof userSchema>;
export const userSchema = z.object({
	id: userIdSchema,
	email: userEmailSchema,
	username: userNameSchema,
	displayName: userDisplayNameSchema,
	firstName: userFirstNameSchema,
	lastName: userLastNameSchema,
	birthday: userBirthdaySchema,
	role: userRole,
	createdAt: z.date({ message: ERROR_KEYS.ERR_IS_DATE }),
	updatedAt: z.date({ message: ERROR_KEYS.ERR_IS_DATE }),
});

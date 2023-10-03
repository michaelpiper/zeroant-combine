export declare const PermissionScope: {
    public: string;
    private: string;
    public_or_private: string;
};
export type IPermissionScope = (typeof PermissionScope)[keyof typeof PermissionScope];

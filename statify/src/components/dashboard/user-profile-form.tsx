"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import toast from "react-hot-toast";
import axios from "axios";
import { User } from "@/app/fetchers/get-user";


const ProfileSchema = z.object({
    username: z.string().min(2),
    email: z.string().email(),
    leetcodeId: z.string().optional(),
    gfgId: z.string().optional(),
    codeforcesId: z.string().optional(),
    githubId: z.string().optional(),
});

type Props = {
    userData: User;
    onSaved: (newData?: any) => void;
    onCancel: () => void;
}

const UserProfileForm = ({ userData, onSaved, onCancel }: Props) => {
    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            username: userData.username,
            email: userData.email,
            leetcodeId: userData.leetcodeId || "",
            gfgId: userData.gfgId || "",
            codeforcesId: userData.codeforcesId || "",
            githubId: userData.githubId || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
        try {
            await axios.patch(`/api/user/update`, values);
            toast.success("Profile updated successfully!");
            onSaved(values);
        } catch (err) {
            toast.error("Failed to update profile.");
        }
    };

    return (
        <Form {...form}>
            <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="leetcodeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>LeetCode ID</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="gfgId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>GFG ID</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="codeforcesId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Codeforces ID</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="githubId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>GitHub Username</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-3 pt-4">
                    <Button type="submit" className="w-full">Save</Button>
                    <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default UserProfileForm;
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useLeetcodeData from "../hook/useLeetcodeData";
import useGfgData from "../hook/useGfgData";
import useGithubData from "../hook/useGithubData";
import useCodeforcesData from "../hook/useCodeforcesData";

export type PlatformKey = "leetcodeId" | "codeforcesId" | "gfgId" | "githubId";

const platformSchema = z.object({
    leetcodeId: z.string().optional(),
    codeforcesId: z.string().optional(),
    gfgId: z.string().optional(),
    githubId: z.string().optional(),
    leetcodeSkipped: z.boolean(),
    codeforcesSkipped: z.boolean(),
    gfgSkipped: z.boolean(),
    githubSkipped: z.boolean(),
});

export type PlatformFormValues = z.infer<typeof platformSchema>;

type UserData = {
    codeforcesId: string;
    gfgId: string;
    githubId: string;
    leetcodeId: string;
    username: string;
};

type ValidatedPlatform = {
    [K in PlatformKey]?: {
        isValid: boolean;
        data: any;
    };
};

export const usePlatformForm = () => {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [invalidFields, setInvalidFields] = useState<PlatformKey[]>([]);
    const [loading, setLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(false);

    // Track which platforms need validation
    const [platformsToValidate, setPlatformsToValidate] = useState<{
        [K in PlatformKey]?: string;
    }>({});

    // Store validated platforms data
    const [validatedPlatforms, setValidatedPlatforms] = useState<ValidatedPlatform>({});

    const form = useForm<PlatformFormValues>({
        resolver: zodResolver(platformSchema),
        defaultValues: {
            leetcodeId: "",
            codeforcesId: "",
            gfgId: "",
            githubId: "",
            leetcodeSkipped: false,
            codeforcesSkipped: false,
            gfgSkipped: false,
            githubSkipped: false,
        },
    });

    const { watch } = form;
    const formValues = watch();

    // Load user from storage
    useEffect(() => {
        const storedUser =
            localStorage.getItem("user") || sessionStorage.getItem("user");
        if (!storedUser) {
            router.push("/");
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [router]);

    // Conditionally fetch data only for platforms that need validation
    const { leetcodeData, isError: isLeetError, isLoading: leetLoading } =
        useLeetcodeData(platformsToValidate.leetcodeId);

    const { gfgData, isError: isGfgError, isLoading: gfgLoading } =
        useGfgData(platformsToValidate.gfgId);

    const { githubData, isError: isGithubError, isLoading: ghLoading } =
        useGithubData(platformsToValidate.githubId);

    const { codeforcesData, isError: isCfError, isLoading: cfLoading } =
        useCodeforcesData(platformsToValidate.codeforcesId);

    // Update validated platforms when data is fetched
    useEffect(() => {
        if (platformsToValidate.leetcodeId && !leetLoading) {
            setValidatedPlatforms((prev) => ({
                ...prev,
                leetcodeId: {
                    isValid: !isLeetError && !!leetcodeData,
                    data: leetcodeData,
                },
            }));
        }
    }, [leetcodeData, isLeetError, leetLoading, platformsToValidate.leetcodeId]);

    useEffect(() => {
        if (platformsToValidate.gfgId && !gfgLoading) {
            setValidatedPlatforms((prev) => ({
                ...prev,
                gfgId: {
                    isValid: !isGfgError && !!gfgData,
                    data: gfgData,
                },
            }));
        }
    }, [gfgData, isGfgError, gfgLoading, platformsToValidate.gfgId]);

    useEffect(() => {
        if (platformsToValidate.githubId && !ghLoading) {
            setValidatedPlatforms((prev) => ({
                ...prev,
                githubId: {
                    isValid: !isGithubError && !!githubData,
                    data: githubData,
                },
            }));
        }
    }, [githubData, isGithubError, ghLoading, platformsToValidate.githubId]);

    useEffect(() => {
        if (platformsToValidate.codeforcesId && !cfLoading) {
            setValidatedPlatforms((prev) => ({
                ...prev,
                codeforcesId: {
                    isValid: !isCfError && !!codeforcesData,
                    data: codeforcesData,
                },
            }));
        }
    }, [codeforcesData, isCfError, cfLoading, platformsToValidate.codeforcesId]);

    const currentlyValidating = leetLoading || gfgLoading || ghLoading || cfLoading;

    // Check if all platforms being validated have completed
    useEffect(() => {
        if (isValidating && !currentlyValidating) {
            // All validations complete
            const failedFields: PlatformKey[] = [];

            Object.entries(platformsToValidate).forEach(([field, value]) => {
                const platformKey = field as PlatformKey;
                if (value && validatedPlatforms[platformKey]?.isValid === false) {
                    failedFields.push(platformKey);
                }
            });

            if (failedFields.length > 0) {
                setInvalidFields(failedFields);
                toast.error("Some IDs are invalid. Please check and try again.");
                setIsValidating(false);
                setLoading(false);
            } else {
                // All validations passed, proceed with submission
                submitToBackend();
            }
        }
    }, [currentlyValidating, isValidating, platformsToValidate, validatedPlatforms]);

    const handleSkipToggle = (field: PlatformKey) => {
        const skipField = `${field.replace("Id", "")}Skipped` as keyof PlatformFormValues;
        const currentValue = form.getValues(skipField);
        form.setValue(skipField, !currentValue);

        if (invalidFields.includes(field)) {
            setInvalidFields((prev) => prev.filter((f) => f !== field));
        }
    };

    const getPlatformStatus = (field: PlatformKey) => {
        const validated = validatedPlatforms[field];
        const isCurrentlyValidating = platformsToValidate[field] &&
            (field === "leetcodeId" ? leetLoading :
                field === "codeforcesId" ? cfLoading :
                    field === "gfgId" ? gfgLoading :
                        field === "githubId" ? ghLoading : false);

        return {
            data: validated?.data || null,
            loading: isCurrentlyValidating,
            error: validated?.isValid === false,
            isValidated: validated !== undefined,
        };
    };

    const submitToBackend = async () => {
        const data = form.getValues();

        try {
            const response = await axios.post("/api/users/platform", {
                user: user?.username ?? "",
                leetcodeId: data.leetcodeSkipped ? null : data.leetcodeId || null,
                codeforcesId: data.codeforcesSkipped
                    ? null
                    : data.codeforcesId || null,
                gfgId: data.gfgSkipped ? null : data.gfgId || null,
                githubId: data.githubSkipped ? null : data.githubId || null,
            });

            if (response.data?.success) {
                // Cache the validated data for dashboard
                const cacheData = {
                    leetcodeData: validatedPlatforms.leetcodeId?.data || null,
                    gfgData: validatedPlatforms.gfgId?.data || null,
                    githubData: validatedPlatforms.githubId?.data || null,
                    codeforcesData: validatedPlatforms.codeforcesId?.data || null,
                };
                sessionStorage.setItem("platformData", JSON.stringify(cacheData));

                toast.success("Platform IDs saved successfully! 🎉");
                router.push(`/dashboard/${user?.username}`);
            } else {
                toast.error("Failed to save platform IDs.");
            }
        } catch (error: any) {
            console.error("Error saving platform IDs:", error);
            toast.error(
                error?.response?.data?.error || "An error occurred while saving."
            );
        } finally {
            setLoading(false);
            setIsValidating(false);
        }
    };

    const onSubmit = async (data: PlatformFormValues) => {
        if (!user?.username?.trim()) {
            toast.error("Please enter your username");
            return;
        }

        const hasAtLeastOne =
            (data.leetcodeId && !data.leetcodeSkipped) ||
            (data.codeforcesId && !data.codeforcesSkipped) ||
            (data.gfgId && !data.gfgSkipped) ||
            (data.githubId && !data.githubSkipped);

        if (!hasAtLeastOne) {
            toast.error("Please add at least one platform ID");
            return;
        }

        setLoading(true);
        setIsValidating(true);
        setInvalidFields([]);

        // Determine which platforms need validation (not already validated or value changed)
        const toValidate: { [K in PlatformKey]?: string } = {};

        if (data.leetcodeId && !data.leetcodeSkipped) {
            const alreadyValidated = validatedPlatforms.leetcodeId;
            if (!alreadyValidated || !alreadyValidated.isValid) {
                toValidate.leetcodeId = data.leetcodeId;
            }
        }

        if (data.codeforcesId && !data.codeforcesSkipped) {
            const alreadyValidated = validatedPlatforms.codeforcesId;
            if (!alreadyValidated || !alreadyValidated.isValid) {
                toValidate.codeforcesId = data.codeforcesId;
            }
        }

        if (data.gfgId && !data.gfgSkipped) {
            const alreadyValidated = validatedPlatforms.gfgId;
            if (!alreadyValidated || !alreadyValidated.isValid) {
                toValidate.gfgId = data.gfgId;
            }
        }

        if (data.githubId && !data.githubSkipped) {
            const alreadyValidated = validatedPlatforms.githubId;
            if (!alreadyValidated || !alreadyValidated.isValid) {
                toValidate.githubId = data.githubId;
            }
        }

        // If nothing to validate (all already validated successfully), submit directly
        if (Object.keys(toValidate).length === 0) {
            submitToBackend();
        } else {
            // Trigger validation by setting platformsToValidate
            setPlatformsToValidate(toValidate);
        }
    };

    const allSkipped =
        formValues.leetcodeSkipped &&
        formValues.codeforcesSkipped &&
        formValues.gfgSkipped &&
        formValues.githubSkipped;

    return {
        form,
        user,
        loading,
        isValidating,
        invalidFields,
        allSkipped,
        handleSkipToggle,
        getPlatformStatus,
        onSubmit,
    };
};
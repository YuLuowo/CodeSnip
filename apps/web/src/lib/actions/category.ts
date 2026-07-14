import { connectDB, Snippet } from "@codesnip/db";

interface PopularTag {
    _id: string;
    count: number;
}

export async function getPopularTags(): Promise<PopularTag[]> {
    await connectDB();

    return Snippet.aggregate([
        {
            $match: {
                isPublic: true
            }
        },
        {
            $unwind: "$tags"
        },
        {
            $group: {
                _id: "$tags",
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $limit: 20
        }
    ]);
}
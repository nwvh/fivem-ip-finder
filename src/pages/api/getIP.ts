import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

const axios = require('axios');
type ResponseData = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method !== 'GET') {
        return res.status(400).json({ message: "Invalid request method!" })
    }
    const link = req.query.joinLink

    axios({
        method: 'GET',
        url: link,
        validateStatus: () => true
    }).then((response: any) => {
        if (response.status === 404) {
            return res.status(401).json({
                message: "error",
            })
        }
        const header = response.headers["x-citizenfx-url"].replace("http://", "").replace("/", "")
        return res.status(200).json({
            message: header,
        })
    });
}

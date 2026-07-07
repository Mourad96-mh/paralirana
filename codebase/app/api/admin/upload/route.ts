import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONFIGURED =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (CONFIGURED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// POST /api/admin/upload — multipart form with a `file` field.
// Returns { url } (Cloudinary secure URL). If Cloudinary isn't configured,
// responds 501 so the admin UI falls back to pasting an image URL.
export async function POST(req: Request) {
  if (!CONFIGURED) {
    return NextResponse.json(
      { error: "Cloudinary non configuré — collez une URL d'image à la place." },
      { status: 501 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${bytes.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "paralirana/products",
      resource_type: "image",
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("[admin/upload]", err);
    return NextResponse.json({ error: "Échec du téléversement" }, { status: 500 });
  }
}

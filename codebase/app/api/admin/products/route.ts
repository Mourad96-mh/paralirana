import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ProductModel, { toDbProduct, fromDbProduct } from "@/models/Product";
import { slugify } from "@/lib/slug";
import { revalidateCatalog } from "@/lib/revalidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/products — full catalog for the admin table.
export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products: products.map(fromDbProduct) });
  } catch (err) {
    console.error("[admin/products GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/admin/products — create a product.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.brand || !body.category || body.price == null) {
      return NextResponse.json(
        { error: "Nom, marque, catégorie et prix sont requis" },
        { status: 400 }
      );
    }

    await connectDB();
    const slug = (body.slug && slugify(body.slug)) || slugify(body.name);

    const exists = await ProductModel.findOne({ slug });
    if (exists) {
      return NextResponse.json(
        { error: `Un produit avec le slug « ${slug} » existe déjà` },
        { status: 409 }
      );
    }

    const product = await ProductModel.create(toDbProduct({ ...body, slug }));
    revalidateCatalog(product.category, product.slug);
    return NextResponse.json(
      { product: fromDbProduct(product.toObject()) },
      { status: 201 }
    );
  } catch (err) {
    console.error("[admin/products POST]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

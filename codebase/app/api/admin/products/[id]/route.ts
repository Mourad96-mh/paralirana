import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ProductModel, { toDbProduct, fromDbProduct } from "@/models/Product";
import { slugify } from "@/lib/slug";
import { revalidateCatalog } from "@/lib/revalidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

// PUT /api/admin/products/[id] — update a product.
export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    await connectDB();

    const current = await ProductModel.findById(params.id);
    if (!current) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    if (body.slug || body.name) {
      const nextSlug = body.slug ? slugify(body.slug) : slugify(body.name);
      if (nextSlug && nextSlug !== current.slug) {
        const clash = await ProductModel.findOne({ slug: nextSlug });
        if (clash) {
          return NextResponse.json(
            { error: `Le slug « ${nextSlug} » est déjà pris` },
            { status: 409 }
          );
        }
        body.slug = nextSlug;
      } else {
        delete body.slug;
      }
    }

    const prevSlug = current.slug;
    const prevCategory = current.category;
    const product = await ProductModel.findByIdAndUpdate(
      params.id,
      toDbProduct(body),
      { new: true }
    );

    // Revalidate both the old and new category/slug in case they changed.
    revalidateCatalog(prevCategory, prevSlug);
    if (product) revalidateCatalog(product.category, product.slug);

    return NextResponse.json({
      product: product ? fromDbProduct(product.toObject()) : null,
    });
  } catch (err) {
    console.error("[admin/products PUT]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(_req: Request, { params }: Params) {
  try {
    await connectDB();
    const product = await ProductModel.findByIdAndDelete(params.id);
    if (!product) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }
    revalidateCatalog(product.category, product.slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/products DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

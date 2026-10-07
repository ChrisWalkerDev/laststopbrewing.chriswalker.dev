"""Canonical GLB export for the home scene.

Run: blender --background blender/LastStopBrewing.blend --python blender/export_home.py
"""
import os

import bpy

out = os.path.normpath(
    os.path.join(os.path.dirname(bpy.data.filepath), "..", "public", "blender", "home.glb")
)
os.makedirs(os.path.dirname(out), exist_ok=True)

# glTF cannot represent procedural shaders; flatten them to their evaluated
# colour (in this unsaved session only) so they don't export as plain white.
PROCEDURAL_FALLBACK = {"A-Frame Oak": (0.36, 0.20, 0.09, 1.0)}
for mat in bpy.data.materials:
    if mat.name in PROCEDURAL_FALLBACK and mat.use_nodes:
        bsdf = next((n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
        if bsdf:
            for link in list(bsdf.inputs["Base Color"].links):
                mat.node_tree.links.remove(link)
            bsdf.inputs["Base Color"].default_value = PROCEDURAL_FALLBACK[mat.name]

bpy.ops.export_scene.gltf(
    filepath=out,
    export_format="GLB",
    export_image_format="AUTO",
    export_apply=True,
    export_texcoords=True,
    export_normals=True,
    export_materials="EXPORT",
    export_cameras=False,
    export_lights=False,
    export_animations=True,
    export_yup=True,
    export_draco_mesh_compression_enable=False,
    use_visible=True,
)
print("EXPORTED", out)

import datetime
from typing import List, Optional
from ..schemas.trail import Trail
from ..schemas.card import PocketCardResponse, CardCheckpoint

class PocketCardService:
    """
    Zero-Screen 1-Page Pocket Guide Generator.
    Produces high-density, printable field cards so hikers can leave their phones in their packs.
    """

    def generate_pocket_card(
        self,
        trail: Trail,
        custom_notes: Optional[str] = None
    ) -> PocketCardResponse:
        # Calculate hiking duration via Naismith's Rule (approx 4 km/h + 1h per 600m ascent)
        est_hours = round((trail.length_km / 4.0) + (trail.elevation_m / 1200.0), 1)

        # Species list
        species_list = []
        if trail.canopy_composition.sugar_maple_pct > 0:
            species_list.append(f"Sugar Maple ({trail.canopy_composition.sugar_maple_pct}%) — 5-lobed leaves, fiery scarlet & burnt orange")
        if trail.canopy_composition.quaking_aspen_pct > 0:
            species_list.append(f"Quaking Aspen ({trail.canopy_composition.quaking_aspen_pct}%) — Fluttering golden coins, white chalky bark")
        if trail.canopy_composition.red_oak_pct > 0:
            species_list.append(f"Red Oak ({trail.canopy_composition.red_oak_pct}%) — Deep russet & crimson, pointed leaf lobes")
        if trail.canopy_composition.alpine_larch_pct > 0:
            species_list.append(f"Alpine Larch ({trail.canopy_composition.alpine_larch_pct}%) — Deciduous conifer needles turning glowing canary gold")
        if trail.canopy_composition.paper_birch_pct > 0:
            species_list.append(f"Paper Birch ({trail.canopy_composition.paper_birch_pct}%) — Bright yellow canopy with peeling white birch bark")

        # Checkpoints
        checkpoints = []
        for vp in trail.viewpoints:
            checkpoints.append(CardCheckpoint(
                name=vp.name,
                distance_km=vp.distance_km,
                elevation_m=vp.elevation_m,
                foliage_note=f"Focus: {vp.species_focus}"
            ))

        # Field Guide Markdown
        markdown_content = f"""# 🥾 WANDER POCKET FIELD CARD — {trail.name.upper()}
**Region:** {trail.region} | **Elevation:** {trail.elevation_m}m | **Distance:** {trail.length_km}km | **Est. Time:** {est_hours}h
**TabPFN Foliage Status:** {trail.foliage_stage_pct}% ({trail.peak_status or 'Peak Window'}) | **Peak Range:** {trail.peak_window_start} to {trail.peak_window_end}

---

### 🌲 CANOPY SPECIES IDENTIFICATION
{chr(10).join(f"- {s}" for s in species_list)}

---

### 📍 TRAIL MILESTONES & ELEVATION CHECKPOINTS
{chr(10).join(f"• **{cp.name}** (KM {cp.distance_km} | {cp.elevation_m}m) — {cp.foliage_note}" for cp in checkpoints)}

---

### 🛡️ TRAILHEAD SAFETY & ZERO-SCREEN FIELD RULES
1. **Phone in Backpack:** Review this card and listen to your 45-second audio briefing before starting. Keep devices stowed.
2. **Leave No Trace:** Stay on marked bedrock/tread to protect fragile alpine moss and autumn understory.
3. **Turnaround Time:** Calculate 50% of daylight elapsed before reaching summit.
{f"4. **Hiker Custom Notes:** {custom_notes}" if custom_notes else ""}

*Generated on {datetime.date.today().strftime('%B %d, %Y')} via Wander Open Phenology Engine.*
"""

        # Print-Optimized Minimalist HTML with CSS @media print
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Wander Pocket Field Card - {trail.name}</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 1.2cm;
  }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1f2937;
    background: #fff;
    line-height: 1.4;
    font-size: 13px;
    margin: 0;
    padding: 20px;
  }}
  .card-container {{
    border: 2px solid #b45309;
    border-radius: 8px;
    padding: 16px;
    max-width: 760px;
    margin: 0 auto;
  }}
  .header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #f59e0b;
    padding-bottom: 10px;
    margin-bottom: 12px;
  }}
  .header h1 {{
    margin: 0;
    font-size: 20px;
    color: #92400e;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}
  .badge {{
    background: #fef3c7;
    color: #92400e;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 11px;
    border: 1px solid #fde68a;
  }}
  .stats-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    background: #fefce8;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 12px;
  }}
  .stat-item {{
    text-align: center;
  }}
  .stat-label {{
    font-size: 10px;
    color: #78350f;
    text-transform: uppercase;
    font-weight: 600;
  }}
  .stat-val {{
    font-size: 14px;
    font-weight: bold;
    color: #1f2937;
  }}
  h2 {{
    font-size: 13px;
    color: #78350f;
    text-transform: uppercase;
    margin-top: 12px;
    margin-bottom: 6px;
    border-left: 3px solid #d97706;
    padding-left: 6px;
  }}
  ul {{
    margin: 0 0 10px 0;
    padding-left: 20px;
  }}
  li {{
    margin-bottom: 4px;
  }}
  .checkpoints-table {{
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
  }}
  .checkpoints-table th, .checkpoints-table td {{
    border: 1px solid #e5e7eb;
    padding: 6px 8px;
    text-align: left;
    font-size: 11px;
  }}
  .checkpoints-table th {{
    background: #f3f4f6;
    color: #374151;
  }}
  .footer {{
    margin-top: 14px;
    border-top: 1px dashed #d1d5db;
    padding-top: 8px;
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #6b7280;
  }}
  @media print {{
    body {{
      padding: 0;
    }}
    .card-container {{
      border: 1.5px solid #000;
    }}
  }}
</style>
</head>
<body>
  <div class="card-container">
    <div class="header">
      <div>
        <h1>🥾 {trail.name}</h1>
        <div style="font-size: 11px; color: #4b5563;">{trail.region} &bull; Difficulty: {trail.difficulty}</div>
      </div>
      <div class="badge">TabPFN Peak: {trail.foliage_stage_pct}%</div>
    </div>

    <div class="stats-grid">
      <div class="stat-item"><div class="stat-label">Elevation</div><div class="stat-val">{trail.elevation_m}m</div></div>
      <div class="stat-item"><div class="stat-label">Length</div><div class="stat-val">{trail.length_km} km</div></div>
      <div class="stat-item"><div class="stat-label">Est. Time</div><div class="stat-val">{est_hours} hrs</div></div>
      <div class="stat-item"><div class="stat-label">Peak Window</div><div class="stat-val">{trail.peak_window_start or 'Active'}</div></div>
    </div>

    <h2>🌲 Canopy Species & Foliage Guide</h2>
    <ul>
      {''.join(f'<li><strong>{s}</strong></li>' for s in species_list)}
    </ul>

    <h2>📍 Trail Milestones & Vista Checkpoints</h2>
    <table class="checkpoints-table">
      <thead>
        <tr>
          <th>Checkpoint</th>
          <th>Distance</th>
          <th>Elevation</th>
          <th>Phenology Focus</th>
        </tr>
      </thead>
      <tbody>
        {''.join(f'<tr><td><strong>{cp.name}</strong></td><td>{cp.distance_km} km</td><td>{cp.elevation_m}m</td><td>{cp.foliage_note}</td></tr>' for cp in checkpoints)}
      </tbody>
    </table>

    <h2>🛡️ Trailhead Rules — Touch Grass / Zero-Screen</h2>
    <ul>
      <li><strong>Zip Phone in Pack:</strong> Rely on this card and physical trail blazes.</li>
      <li><strong>Stay on Trail:</strong> Protect alpine soil and fragile autumn moss carpets.</li>
      {f"<li><strong>Custom Notes:</strong> {custom_notes}</li>" if custom_notes else ""}
    </ul>

    <div class="footer">
      <span>Wander Open Phenology Engine &bull; TabPFN Prior Labs</span>
      <span>Generated {datetime.date.today().strftime('%Y-%m-%d')} &bull; Keep Nature Wild</span>
    </div>
  </div>
</body>
</html>
"""

        return PocketCardResponse(
            trail_id=trail.id,
            trail_name=trail.name,
            region=trail.region,
            elevation_gain_m=trail.elevation_m,
            total_length_km=trail.length_km,
            estimated_hiking_time_hours=est_hours,
            difficulty=trail.difficulty,
            foliage_status=trail.peak_status or "Peak Window",
            foliage_stage_pct=trail.foliage_stage_pct or 95.0,
            primary_tree_species=species_list,
            checkpoints=checkpoints,
            emergency_contacts=["Trail Ranger Dispatch: 911", "National Park SAR Monitor"],
            field_guide_markdown=markdown_content,
            field_guide_html=html_content
        )


# Global singleton instance
pocket_card_service = PocketCardService()

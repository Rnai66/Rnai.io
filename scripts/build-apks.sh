#!/usr/bin/env bash
#
# build-apks.sh — Build small, installable APKs for every Rnai.io app and
# collect them in one folder, ready to upload to GitHub Releases.
#
# Usage:
#   ./build-apks.sh              # build ALL apps
#   ./build-apks.sh moneyma      # build one app (id from the list below)
#   ./build-apks.sh quom lotterymap   # build several
#
# Options (environment variables):
#   OUT=~/rnai-apks              # where finished APKs are copied (default)
#   BUILD_TYPE=release|debug     # default: release
#                                #   debug = auto-signed, installs immediately
#                                #           (best for quick sideload / free downloads)
#                                #   release = smaller, but must be SIGNED to install
#   SPLIT=1                      # Flutter: build per-ABI (smaller files). Default on.
#
# App ids: rnai-mobile  moneyma  quom  lotterymap  h2hfleet
#
# ── Adjust these paths if your folders live elsewhere ───────────────────────
RNAI_MOBILE="$HOME/rnai-mobile"
MONEYMA="$HOME/Project/PFM"
QUOM="$HOME/Project/quom-app/mobile"
LOTTERYMAP="$HOME/Project/lotterymap"
H2HFLEET="$HOME/H2Hfleet/h2hfleet"
# ────────────────────────────────────────────────────────────────────────────

set -uo pipefail
OUT="${OUT:-$HOME/rnai-apks}"
BUILD_TYPE="${BUILD_TYPE:-release}"
SPLIT="${SPLIT:-1}"
mkdir -p "$OUT"

GREEN=$'\033[0;32m'; RED=$'\033[0;31m'; YEL=$'\033[1;33m'; NC=$'\033[0m'
ok()   { echo "${GREEN}✓ $*${NC}"; }
warn() { echo "${YEL}! $*${NC}"; }
err()  { echo "${RED}✗ $*${NC}"; }
hdr()  { echo; echo "──────── $* ────────"; }

FAILED=()
BUILT=()

need() { command -v "$1" >/dev/null 2>&1 || { err "ไม่พบคำสั่ง '$1' — ติดตั้งก่อน ($2)"; return 1; }; }

# Copy the produced APK(s) into $OUT with a clean name. $1=glob dir, $2=outname
collect() {
  local searchdir="$1" name="$2" found=0 f
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    local abi=""
    case "$f" in
      *arm64-v8a*)   abi="-arm64" ;;
      *armeabi-v7a*) abi="-arm32" ;;
      *x86_64*)      abi="-x64" ;;
      *x86*)         abi="-x86" ;;
    esac
    case "$f" in *unsigned*) warn "ได้ไฟล์ unsigned — ต้องเซ็นก่อนติดตั้ง (ดู NOTE ท้ายสคริปต์): $(basename "$f")";; esac
    cp "$f" "$OUT/${name}${abi}.apk"
    ok "→ $OUT/${name}${abi}.apk"
    found=1; BUILT+=("${name}${abi}.apk")
  done < <(find "$searchdir" -name "*.apk" -type f 2>/dev/null | grep -E "/(release|debug)/" )
  [ "$found" = 1 ] || { err "ไม่พบ .apk ที่ build ออกมาใน $searchdir"; FAILED+=("$name"); }
}

build_flutter() {
  local dir="$1" name="$2"
  hdr "Flutter: $name"
  [ -d "$dir" ] || { err "ไม่พบโฟลเดอร์ $dir"; FAILED+=("$name"); return; }
  need flutter "https://docs.flutter.dev/get-started/install" || { FAILED+=("$name"); return; }
  ( cd "$dir" \
    && flutter pub get \
    && if [ "$SPLIT" = 1 ] && [ "$BUILD_TYPE" = release ]; then \
         flutter build apk --release --split-per-abi; \
       else \
         flutter build apk --"$BUILD_TYPE"; \
       fi ) \
    && collect "$dir/build/app/outputs/flutter-apk" "$name" \
    || { err "$name build ล้มเหลว"; FAILED+=("$name"); }
}

build_capacitor() {
  local dir="$1" name="$2"
  hdr "Capacitor: $name"
  [ -d "$dir" ] || { err "ไม่พบโฟลเดอร์ $dir"; FAILED+=("$name"); return; }
  need node "https://nodejs.org" || { FAILED+=("$name"); return; }
  ( cd "$dir" \
    && { [ -d node_modules ] || npm install; } \
    && npm run build \
    && npx cap sync android \
    && cd android \
    && chmod +x ./gradlew \
    && ./gradlew "assemble${BUILD_TYPE^}" ) \
    && collect "$dir/android/app/build/outputs/apk" "$name" \
    || { err "$name build ล้มเหลว"; FAILED+=("$name"); }
}

build_expo() {
  local dir="$1" name="$2"
  hdr "Expo (local gradle): $name"
  [ -d "$dir" ] || { err "ไม่พบโฟลเดอร์ $dir"; FAILED+=("$name"); return; }
  need node "https://nodejs.org" || { FAILED+=("$name"); return; }
  ( cd "$dir" \
    && { [ -d node_modules ] || npm install; } \
    && { [ -d android ] || npx expo prebuild --platform android --no-install; } \
    && cd android \
    && chmod +x ./gradlew \
    && ./gradlew "assemble${BUILD_TYPE^}" ) \
    && collect "$dir/android/app/build/outputs/apk" "$name" \
    || { err "$name build ล้มเหลว"; FAILED+=("$name"); }
  # ทางเลือก cloud (ไม่ต้องตั้ง Android SDK): eas build -p android --profile preview
}

run_one() {
  case "$1" in
    rnai-mobile) build_expo      "$RNAI_MOBILE" "rnai-mobile" ;;
    moneyma)     build_capacitor "$MONEYMA"     "moneyma" ;;
    quom)        build_flutter   "$QUOM"        "quom" ;;
    lotterymap)  build_flutter   "$LOTTERYMAP"  "lotterymap" ;;
    h2hfleet)    build_flutter   "$H2HFLEET"    "h2hfleet" ;;
    *) err "ไม่รู้จักแอป '$1' (rnai-mobile moneyma quom lotterymap h2hfleet)";;
  esac
}

echo "Build type: ${BUILD_TYPE}   |   Output: ${OUT}"
if [ "$#" -eq 0 ]; then
  for a in rnai-mobile moneyma quom lotterymap h2hfleet; do run_one "$a"; done
else
  for a in "$@"; do run_one "$a"; done
fi

hdr "สรุป"
[ "${#BUILT[@]}"  -gt 0 ] && { ok  "สำเร็จ ${#BUILT[@]} ไฟล์ใน $OUT:"; printf '   - %s\n' "${BUILT[@]}"; }
[ "${#FAILED[@]}" -gt 0 ] && { err "ล้มเหลว: ${FAILED[*]}"; }
echo
cat <<'NOTE'
NOTE — การเซ็นไฟล์ (signing):
  • BUILD_TYPE=debug  → APK เซ็นด้วย debug key อัตโนมัติ ติดตั้งได้ทันที (เหมาะกับแจกฟรี/ทดสอบ)
  • BUILD_TYPE=release + ได้ไฟล์ *-unsigned.apk → ต้องเซ็นก่อน:
      apksigner sign --ks my.keystore --ks-key-alias mykey \
        --out signed.apk app-release-unsigned.apk
    (MoneyMa มี ANDROID_SIGNING_CONFIG.md ตั้ง signing ไว้แล้ว — release จะเซ็นเอง)

ขั้นต่อไป: อัปไฟล์ใน ~/rnai-apks ขึ้น GitHub Releases แล้ววาง URL ลงใน
  rnai-platform/src/lib/products.ts → ช่อง downloads ของแต่ละแอป เช่น
    downloads: { android: "https://github.com/<user>/<repo>/releases/download/v1.0.0/moneyma.apk" }
NOTE

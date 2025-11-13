import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
// @ts-ignore
import { ChevronDown, ChevronUp, Maximize2, Square } from "lucide-react-native";
import ImageZoom from "react-native-image-pan-zoom";

export default function HomeScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [menuState, setMenuState] = useState<"normal" | "full" | "min">("normal");
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const zoomRef = useRef<any>(null);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const size = screenWidth * 0.8;

  const categories = [
    { name: "Inicio", color: "#0a0a0aff" },
    { name: "Neurotoxicidad", color: "#d64fc4" },
    { name: "Reacción vagal", color: "#c7d5ef" },
    { name: "Clasificación del edema", color: "#fff7ea" },
    { name: "Daño tisular local", color: "#a5f2ff" },
    { name: "Coagulación y circulación sistémica", color: "#ffc6f6" },
    { name: "Alteraciones renales cualitativas", color: "#fff1b4" },
    { name: "Exámenes paraclínicos complementarios", color: "#8eefdd" },
    { name: "Clasificación y tratamiento", color: "#40bdbc" },
  ];

  // ✅ Tipo de bullet flexible
  type BulletItem =
    | string
    | {
        text?: string;
        bold?: string;
        rest?: string;
      };

  const categoryInfo: Record<
    string,
    { text: string; bullets?: BulletItem[]; image?: any }
  > = {
    Inicio: {
      text: "Tenga en cuenta la información que se presenta a continuación.",
      bullets: [
        "Los síntomas descritos para cada categoría NO se presentarán necesariamente al mismo tiempo.",
        "Las principales familias de serpientes venenosas de significancia clínica en Colombia son víboras (Bothrops, cascabel, Lachesis) y elápidos (coral, marina).",
        "El tipo de suero antiofídico (antídoto) y la dosis a administrar dependen de la familia de la serpiente involucrada (víbora, elápido), y la gravedad clínica del envenenamiento (leve, moderado o grave).",
        "Dejar al paciente con sospecha de accidente ofídico en observación por 6-12 horas y evaluar la progresividad de los síntomas.",
        "Toda mordedura en cuello, cara o tronco debe ser tratada como grave.",
        "Accidentes por serpientes venenosas diferentes a víboras y elápidos NO se consideran de significancia clínica, por lo cual NO requieren de suero antiofídico.",
        "En algunos casos se presentan 'mordeduras secas' por parte de serpientes venenosas, lo cual significa que no se inocula veneno. Es necesario monitorear la aparición de síntomas para decidir la necesidad de aplicar suero antiofídico.",
      ],
    },

    Neurotoxicidad: {
      text: "Los efectos neurotóxicos pueden dividirse según su severidad.",
      bullets: [
        { bold: "🟢 Leve:", rest: " Mareo, visión borrosa, fotofobia, adormecimiento local, parestesias, náusea, vómito." },
        { bold: "🟡 Moderado:", rest: " Parestesias, mialgias leves, náusea, vómito, ptosis palpebral, alteraciones de la visión, oftalmoplejía, fascies miasténica (Rosenfeld), astenia, disartria." },
        { bold: "🔴 Grave:", rest: " Parálisis progresiva, compromiso respiratorio, falla ventilatoria." },
      ],
    },

    "Reacción vagal": {
      text: "En mordedura por *Lachesis* puede haber estimulación persistente del nervio vago, pero cuadros similares pueden ocurrir por estrés, miedo o dolor intenso.",
      bullets: [
        "Bradicardia",
        "Diarrea profusa",
        "Hipotensión",
        "Mareo",
        "Alteraciones de la conciencia",
        "Diaforesis",
        "Palidez marcada",
        "Náuseas y vómito",
        "Visión borrosa",
      ],
    },

    "Clasificación del edema": {
      text: "El edema se clasifica según su extensión y progresividad.",
      bullets: [
        "Perilesional no progresivo: Afectación local no progresiva. Tiende a disminuir o desaparecer después de 6 horas.",
        "Leve progresivo: 1–2 segmentos en la extremidad, diferencia de diámetro ≤ 4 cm, sin compromiso del tronco.",
        "Moderado progresivo: 2–3 segmentos, diferencia de diámetro > 4 cm, sin compromiso del tronco.",
        "Grave progresivo: 3 o más segmentos, compromiso del tronco, tendencia a avanzar con el tiempo.",
      ],
    },

    "Daño tisular local": {
      text: "Ejemplos de lesiones locales observadas:",
      bullets: [
        "A) Lesión paralesional leve (Bothrops)",
        "B) Equimosis severa (Bothrops)",
        "C) Flictenas serohemáticas (Bothrops)",
        "D) Necrosis extensa (Bothrops)",
        "E) Lesiones mecánicas aserradas (serpiente no venenosa)",
      ],
    },

    "Coagulación y circulación sistémica": {
      text: "Las alteraciones en la coagulación pueden comprometer la circulación sistémica y producir sangrados.",
      bullets: ["Hemorragias", "Trombosis", "Equimosis"],
    },

    "Alteraciones renales cualitativas": {
      text: "Cambios cualitativos en la función renal tras el envenenamiento.",
      bullets: ["Oliguria", "Proteinuria", "Hematuria"],
    },

    "Exámenes paraclínicos complementarios": {
      text: "Pruebas recomendadas para la valoración integral del paciente:",
      bullets: ["Hemograma", "Bioquímica sanguínea", "Pruebas de coagulación"],
    },

    "Clasificación y tratamiento": {
      text: "Cada categoría requiere un manejo según severidad.",
      bullets: [
        "Tratamiento conservador en casos leves.",
        "Intervención farmacológica (antiveneno) según protocolo.",
        "Procedimientos quirúrgicos en necrosis o daño tisular severo.",
      ],
    },
  };

  const handleResetZoom = () => setResetTrigger((p) => p + 1);
  const handleResetRotation = () => setRotation(0);
  const handleZoomChange = (scale: number) => setIsZoomed(scale > 1.05);

  return (
    <View style={styles.container}>
      {/* 🔹 Controles de rotación y zoom */}
      <View style={styles.topControls}>
        <View style={styles.rotationControls}>
          <TouchableOpacity onPress={() => setRotation((r) => r - 30)}>
            <Text style={styles.rotationText}>↺</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleResetRotation}>
            <Text
              style={[
                styles.rotationTextCenter,
                { color: rotation === 0 ? "#888" : "#007aff" },
              ]}
            >
              0°
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setRotation((r) => r + 30)}>
            <Text style={styles.rotationText}>↻</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: isZoomed ? "white" : "#e0e0e0" }]}
          onPress={handleResetZoom}
        >
          <Maximize2 size={20} color={isZoomed ? "#007aff" : "#888"} />
        </TouchableOpacity>
      </View>

      {/* 🔹 Diagrama */}
      <View style={styles.diagramBackground}>
        <ImageZoom
          key={resetTrigger}
          ref={zoomRef}
          cropWidth={screenWidth}
          cropHeight={screenHeight * 0.62}
          imageWidth={size}
          imageHeight={size}
          minScale={1}
          maxScale={5}
          enableCenterFocus={false}
          onMove={(e: any) => handleZoomChange(e.scale)}
        >
          <Animated.Image
            source={require("../../assets/images/ruedita_png.png")}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: "#d7ebe4",
              transform: [{ rotate: `${rotation}deg` }],
            }}
            resizeMode="contain"
          />
        </ImageZoom>
      </View>

      {/* 🔹 Menú blanco */}
      {menuState !== "min" && (
        <View
          style={[
            styles.menuContainer,
            menuState === "full" && {
              position: "absolute",
              top: 70,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 0,
              paddingTop: 80,
              zIndex: 30,
            },
          ]}
        >
          {/* Botones del menú */}
          <View style={[styles.menuButtonsGroup, { top: 10 }]}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setMenuState("min")}
            >
              <ChevronDown size={18} color="#007aff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setMenuState("normal")}
            >
              <Square size={18} color="#007aff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setMenuState("full")}
            >
              <ChevronUp size={18} color="#007aff" />
            </TouchableOpacity>
          </View>

          <Animated.ScrollView
            style={styles.menu}
            contentContainerStyle={{
              paddingVertical: 10,
              alignItems: "center",
              paddingRight: 4,
            }}
            showsVerticalScrollIndicator
          >
            <Text style={styles.sectionTitleMenu}>
              Información complementaria de cada categoría
            </Text>

            {categories.map((cat) => (
              <Pressable
                key={cat.name}
                style={[styles.button, { backgroundColor: cat.color }]}
                onPress={() => setSelected(cat.name)}
              >
                <Text
                  style={[styles.buttonText, { color: cat.name === "Inicio" ? "white" : "black" }]}
                >
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </Animated.ScrollView>
        </View>
      )}

      {/* 🔹 Modal */}
      <Modal visible={!!selected} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <ScrollView style={{ maxHeight: "80%" }}>
              {selected && (
                <>
                  <Text style={styles.modalTitle}>{selected}</Text>
                  <Text style={styles.modalText}>{categoryInfo[selected]?.text}</Text>

                  {categoryInfo[selected]?.bullets?.map((item, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      {typeof item === "string" ? (
                        <Text style={styles.bulletText}>{item}</Text>
                      ) : (
                        <Text style={styles.bulletText}>
                          <Text style={styles.bulletBold}>{item.bold}</Text>
                          {item.rest}
                        </Text>
                      )}
                    </View>
                  ))}
                </>
              )}
            </ScrollView>
            <Text style={styles.close} onPress={() => setSelected(null)}>
              Cerrar
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ====================== ESTILOS ======================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d7ebe4", alignItems: "center", paddingTop: 40 },
  diagramBackground: {
    backgroundColor: "#d7ebe4",
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    position: "absolute",
    top: 40,
    zIndex: 20,
  },
  rotationControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 6,
    elevation: 4,
  },
  resetButton: {
    borderRadius: 25,
    padding: 8,
    elevation: 4,
  },
  rotationText: { fontSize: 16, fontWeight: "bold", marginHorizontal: 6, color: "#007aff" },
  rotationTextCenter: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#007aff",
    paddingHorizontal: 8,
  },
  menuContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  menuButtonsGroup: { position: "absolute", right: 12, flexDirection: "row", zIndex: 40 },
  menuButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 6,
    marginLeft: 6,
  },
  menu: { flex: 1, width: "96%", alignSelf: "center" },
  sectionTitleMenu: { fontSize: 16, fontWeight: "600", color: "#00786b", marginBottom: 8 },
  button: {
    width: "85%",
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 6,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: { fontWeight: "bold", textAlign: "center" },
  floatingButton: {
    position: "absolute",
    bottom: 60,
    right: 25,
    backgroundColor: "#007aff",
    padding: 14,
    borderRadius: 30,
    elevation: 6,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: { backgroundColor: "#cce7ff", padding: 20, borderRadius: 10, width: "85%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  modalText: { fontSize: 15, marginBottom: 10, color: "#333" },
  close: { color: "blue", textAlign: "right", marginTop: 10, fontSize: 16 },

  // 🟢 Bullets mejorados
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    marginLeft: 5,
  },
  bulletDot: { fontSize: 28, lineHeight: 22, marginRight: 8, color: "#00786b" },
  bulletText: { flex: 1, fontSize: 16, lineHeight: 24, color: "#222" },
  bulletBold: { fontWeight: "bold", color: "#000" },
});

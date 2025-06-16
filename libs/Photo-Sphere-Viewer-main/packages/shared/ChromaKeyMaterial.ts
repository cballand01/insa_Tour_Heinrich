import { Color, ColorRepresentation, ShaderMaterial, Texture, Vector2 } from 'three';
import chromaKeyFragment from './shaders/chromaKey.fragment.glsl';
import chromaKeyVertex from './shaders/chromaKey.vertex.glsl';

type ShaderUniforms = {
    map: { value: Texture };
    repeat: { value: Vector2 };
    offset: { value: Vector2 };
    alpha: { value: number };
    keying: { value: boolean };
    color: { value: Color };
    similarity: { value: number };
    smoothness: { value: number };
    spill: { value: number };
};

type ChromaKey = {
    /** @default false */
    enabled: boolean;
    /** @default 0x00ff00 */
    color?: ColorRepresentation | { r: number; g: number; b: number };
    /** @default 0.2 */
    similarity?: number;
    /** @default 0.2 */
    smoothness?: number;
};

export class ChromaKeyMaterial extends ShaderMaterial {
    override uniforms: ShaderUniforms;

    get map(): Texture {
        return this.uniforms.map.value;
    }

    set map(map: Texture) {
        this.uniforms.map.value = map;
    }

    set alpha(alpha: number) {
        this.uniforms.alpha.value = alpha;
    }

    get offset(): Vector2 {
        return this.uniforms.offset.value;
    }

    get repeat(): Vector2 {
        return this.uniforms.repeat.value;
    }

    set chromaKey(chromaKey: ChromaKey) {
        this.uniforms.keying.value = chromaKey?.enabled === true;
        if (chromaKey?.enabled) {
            if (typeof chromaKey.color === 'object' && 'r' in chromaKey.color) {
                this.uniforms.color.value.set(
                    chromaKey.color.r / 255,
                    chromaKey.color.g / 255,
                    chromaKey.color.b / 255,
                );
            } else {
                this.uniforms.color.value.set(chromaKey.color ?? 0x00ff00);
            }
            this.uniforms.similarity.value = chromaKey.similarity ?? 0.2;
            this.uniforms.smoothness.value = chromaKey.smoothness ?? 0.2;
        }
    }

    constructor(params?: {
        map?: Texture;
        alpha?: number;
        chromaKey?: ChromaKey;
    }) {
        super({
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: {
                map: { value: params?.map },
                repeat: { value: new Vector2(1, 1) },
                offset: { value: new Vector2(0, 0) },
                alpha: { value: params?.alpha ?? 1 },
                keying: { value: false },
                color: { value: new Color(0x00ff00) },
                similarity: { value: 0.2 },
                smoothness: { value: 0.2 },
                spill: { value: 0.1 },
            } satisfies ShaderUniforms,
            vertexShader: chromaKeyVertex,
            fragmentShader: chromaKeyFragment,
        });

        this.chromaKey = params?.chromaKey;
    }
}

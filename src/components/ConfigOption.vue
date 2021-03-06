<template>
  <div
    v-if="type === 'slider'"
  >
    <v-row class="px-5 py-2">
      <v-col
        cols="12"
        class="py-0"
      >
        <v-subheader
          class="panel-subheader pl-0"
        >
          {{ labelWithUnits }}
        </v-subheader>
        <v-slider
          :color="color"
          hide-details
          thumb-size="24"
          :thumb-label="true"
          :title="tooltip"
          :value="value"
          :min="min"
          :max="max"
          :step="step"
          @input="$emit('input', $event)"
        >
          <v-tooltip
            slot="prepend"
            bottom
          >
            <template
              v-slot:activator="{on, attrs}"
            >
              <v-btn
                slot="activator"
                icon
                text
                :max-height="24"
                :max-width="24"
                v-bind="attrs"
                v-on="on"
                @click="reset"
              >
                <v-icon
                  class="v-input__icon"
                >
                  mdi-close
                </v-icon>
              </v-btn>
            </template>
            <span>Reset default</span>
          </v-tooltip>
          <template v-slot:append>
            <v-text-field
              v-model="value"
              class="mt-0 pt-0"
              type="number"
              style="width: 72px"
              :min="min"
              :max="max"
              :step="step"
              dense
              hide-details
              outlined
            />
          </template>
        </v-slider>
      </v-col>
    </v-row>
  </div>
  <div
    v-else-if="type === 'checkbox'"
  >
    <v-row class="px-5 py-3">
      <v-col
        cols="12"
        class="py-0"
      >
        <v-checkbox
          :label="label"
          :value="value"
          :title="tooltip"
          @input="$emit('input', $event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'slider',
      validator(value) {
        return ['slider', 'checkbox'].indexOf(value) !== -1;
      },
    },
    value: {
      type: [String, Number, Boolean],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      required: true,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
    step: {
      type: Number,
      default: 1,
    },
    color: {
      type: String,
      required: true,
    },
    units: {
      type: String,
      required: false,
      default: null,
    },
  },
  computed: {
    labelWithUnits() {
      if (this.units) {
        return `${this.label} (${this.units})`;
      }
      return this.label;
    },
  },
  methods: {
    reset() {
      this.$emit('input', this.default);
    },
  },
};
</script>

<style scoped>
.panel-subheader {
  height: 32px;
}
</style>

<style>
.v-input__append-outer {
  margin: -3px 0 0;
}
</style>

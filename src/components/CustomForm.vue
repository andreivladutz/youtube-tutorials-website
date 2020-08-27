<template>
  <div>
    <form class="vue-form" @submit.prevent="submit">
      <div v-show="!email.valid" class="error-message text-center">
        <p class="mb-0">
          <i>Please enter a valid email address.</i>
        </p>
      </div>
      <div v-if="errors && errors.length" class="error-message text-center">
        <p v-for="(error, idx) in errors" :key="idx" class="mb-0">
          <i>{{ error }}</i>
        </p>
      </div>

      <fieldset>
        <legend></legend>
        <div v-for="(field, idx) in config.fields" :key="field.type">
          <label class="label" :for="`field_${idx}`">{{ field.label }}</label>
          <textarea
            v-if="field.type === 'message'"
            :id="`field_${idx}`"
            class="message textarea"
            required
            v-model="message.text"
            :maxlength="message.maxLength"
          ></textarea>
          <input
            v-else
            :id="`field_${idx}`"
            :type="field.type"
            :class="[
              'input',
              field.type !== 'email' || email.valid ? '' : 'error',
            ]"
            required
            :value="getInputValue(field)"
            @input="setValueFromInput(field, $event.target.value)"
          />

          <!-- The counter in case of a textarea (message field) -->
          <span v-if="field.type === 'message'" class="counter"
            >{{ message.text.length }} / {{ message.maxLength }}</span
          >
        </div>

        <div class="pricing-table-cta mb-8">
          <input
            type="submit"
            :value="config.buttonText"
            class="button button-primary button-shadow"
            href="#"
          />
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomFormParam, FormField, CustomFormData } from "@/store/types";

// Regular expression from W3C HTML5.2 input specification:
// https://www.w3.org/TR/html/sec-forms.html#email-state-typeemail
const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export default Vue.extend({
  props: {
    config: {
      type: Object as PropType<CustomFormParam>,
      required: true,
    },
    // Display errors to the user
    errors: {
      type: Array as PropType<string[]>,
    },
  },
  // the instance state
  data: function(): CustomFormData {
    const formData: CustomFormData = {};
    const fields = this.config.fields;

    for (const field of fields) {
      switch (field.type) {
        case "text":
          formData.text = "";
          break;
        case "email":
          formData.email = {
            value: "",
            valid: true,
          };
          break;
        case "password":
          formData.password = "";
          break;
        case "message":
          formData.message = {
            text: "",
            maxLength: field.maxLength || Infinity,
          };
      }
    }

    return formData;
  },
  methods: {
    // Returns the input's value depending on its type
    getInputValue(field: FormField) {
      switch (field.type) {
        case "text":
          return this.text;
        case "email":
          return this.email ? this.email.value : "";
        case "password":
          return this.password;
      }
    },
    // Sets the corresponding form value from the input
    setValueFromInput(field: FormField, newValue: string) {
      switch (field.type) {
        case "text":
          this.text = newValue;
          break;
        case "email":
          if (this.email) this.email.value = newValue;
          break;
        case "password":
          this.password = newValue;
          break;
      }
    },

    // submit form handler
    submit: function() {
      this.$emit("submitted", { ...this.$data });
    },
    // validate by type and value
    validate: function(type: string, value: string) {
      if (type === "email" && this.email) {
        this.email.valid = this.isEmail(value);
      }
    },
    // check for valid email adress
    isEmail: function(value: string) {
      return emailRegExp.test(value);
    },
  },
  watch: {
    // watching nested property
    "email.value": function(value) {
      this.validate("email", value);
    },
  },
});
</script>

<style>
.vue-form fieldset {
  margin: 24px 0 0 0;
  border: none;
  outline: none;
}

.vue-form div {
  position: relative;
  margin: 20px 0;
}
.vue-form h4,
.vue-form .label {
  color: #94aab0;
  margin-bottom: 10px;
}
.vue-form .label {
  display: block;
}

.vue-form input[type="text"],
.vue-form input[type="email"],
.vue-form textarea,
.vue-form select,
.vue-form legend {
  display: block;
  width: 100%;
  appearance: none;
}
.vue-form input[type="text"],
.vue-form input[type="email"],
.vue-form textarea,
.vue-form select {
  padding: 12px;
  border: 1px solid #cfd9db;
  /* background-color: #ffffff; */
  border-radius: 0.25em;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.08);
}
.vue-form input[type="text"]:focus,
.vue-form input[type="email"]:focus,
.vue-form textarea:focus,
.vue-form select:focus {
  outline: none;
  border-color: #2c3e50;
  box-shadow: 0 0 5px rgba(44, 151, 222, 0.2);
}

.vue-form textarea {
  min-height: 120px;
  resize: vertical;
  overflow: auto;
}

.vue-form input[type="submit"]:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(44, 151, 222, 0.2);
}
.vue-form input[type="submit"]:active {
  transform: scale(0.9);
}
.vue-form .error-message {
  height: 35px;
  margin: 0px;
}
.vue-form .error-message p {
  background: #e4653f;
  display: inline-block;
  width: auto;
  color: #ffffff;
  font-size: 1.1rem;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  border-radius: 0.25em;
  padding: 0.5rem;
  padding-left: 0.8rem;
  padding-right: 0.8rem;
}
.vue-form .error {
  border-color: #e94b35 !important;
}
.vue-form .counter {
  background-color: #ecf0f1;
  position: absolute;
  right: 0px;
  top: 0px;
  font-size: 10px;
  padding: 4px;

  border-radius: 10%;
}

@-webkit-keyframes cd-bounce {
  0%,
  100% {
    -webkit-transform: scale(1);
  }
  50% {
    -webkit-transform: scale(0.8);
  }
}
@-moz-keyframes cd-bounce {
  0%,
  100% {
    -moz-transform: scale(1);
  }
  50% {
    -moz-transform: scale(0.8);
  }
}
@keyframes cd-bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
}
</style>

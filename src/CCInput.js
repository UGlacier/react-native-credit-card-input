import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewPropTypes,
} from "react-native";

const s = StyleSheet.create({
  baseInputContainerStyle: {
    position: 'relative'
  },
  baseInputStyle: {
    color: "black",
  },
  baseClearButtonContainerStyle: {
    position: 'absolute'
  },
});

export default class CCInput extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,

    status: PropTypes.oneOf(["valid", "invalid", "incomplete"]),

    containerStyle: ViewPropTypes.style,
    inputContainerStyle: ViewPropTypes.style,
    inputStyle: Text.propTypes.style,
    labelStyle: Text.propTypes.style,
    clearButtonContainerStyle: ViewPropTypes.style,
    renderErrorElement: PropTypes.func,
    renderErrorPlaceholderElement: PropTypes.func,
    renderClearButton: PropTypes.func,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onBecomeEmpty: PropTypes.func,
    onBecomeValid: PropTypes.func,
    additionalInputProps: PropTypes.shape(TextInput.propTypes),
  };

  static defaultProps = {
    label: "",
    value: "",
    status: "incomplete",
    containerStyle: {},
    inputContainerStyle: {},
    inputStyle: {},
    labelStyle: {},
    clearButtonContainerStyle: {},
    onFocus: () => {},
    onBlur: () => {},
    onChange: () => {},
    onBecomeEmpty: () => {},
    onBecomeValid: () => {},
    additionalInputProps: {},
  };

  componentWillReceiveProps = newProps => {
    const { status, value, onBecomeEmpty, onBecomeValid, field } = this.props;
    const { status: newStatus, value: newValue } = newProps;

    if (value !== "" && newValue === "") onBecomeEmpty(field);
    if (status !== "valid" && newStatus === "valid") onBecomeValid(field);
  };

  focus = () => this.refs.input.focus();

  _onFocus = () => this.props.onFocus(this.props.field);
  _onBlur = () => this.props.onBlur(this.props.field);
  _onChange = value => this.props.onChange(this.props.field, value);
  _onClear = () => this.props.onChange(this.props.field, '');

  render() {
    const { field, label, value, placeholder, status, keyboardType,
            containerStyle, inputContainerStyle, inputStyle, labelStyle, clearButtonContainerStyle,
            renderErrorElement, renderErrorPlaceholderElement, renderClearButton,
            validColor, invalidColor, placeholderColor,
            additionalInputProps } = this.props;
    return (
      <TouchableOpacity onPress={this.focus}
        activeOpacity={0.99}>
        <View style={[containerStyle]}>
          { !!label && <Text style={[labelStyle]}>{label}</Text>}
          <View style={[s.baseInputContainerStyle, inputContainerStyle]}>
            <TextInput ref="input"
              {...additionalInputProps}
              keyboardType={keyboardType}
              autoCapitalise="words"
              autoCorrect={false}
              style={[
                s.baseInputStyle,
                inputStyle,
                ((validColor && status === "valid") ? { color: validColor } :
                (invalidColor && status === "invalid") ? { color: invalidColor } :
                {}),
              ]}
              underlineColorAndroid={"transparent"}
              placeholderTextColor={placeholderColor}
              placeholder={placeholder}
              value={value}
              onFocus={this._onFocus}
              onBlur={this._onBlur}
              onChangeText={this._onChange} />
            <TouchableOpacity
              style={[s.baseClearButtonContainerStyle, clearButtonContainerStyle]}
              onPress={this._onClear}
            >
              {value ? renderClearButton?.(field) : null}
            </TouchableOpacity>
          </View>
          {status === "invalid" ? renderErrorElement?.(field) : renderErrorPlaceholderElement?.(field)}
        </View>
      </TouchableOpacity>
    );
  }
}

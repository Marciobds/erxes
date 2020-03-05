import Icon from 'modules/common/components/Icon';
import React from 'react';
import styled from 'styled-components';
import { rgba } from '../styles/color';
import colors from '../styles/colors';
import { IAttachment } from '../types';
import { readFile } from '../utils';
import ImageWithPreview from './ImageWithPreview';

export const AttachmentWrapper = styled.div`
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  color: ${colors.textPrimary};
  position: relative;

  img {
    max-width: 100%;
  }

  &:hover {
    background: ${rgba(colors.colorCoreDarkBlue, 0.08)};
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  padding: 10px 15px;
  word-wrap: break-word;

  h5 {
    margin: 0 0 5px;
    display: flex;
    font-weight: bold;
  }
`;

const Download = styled.a`
  color: ${colors.colorCoreGray};
  padding: 0 5px;
  margin-left: 5px;

  &:hover {
    color: ${colors.colorCoreBlack};
  }
`;

const PreviewWrapper = styled.div`
  height: 80px;
  width: 110px;
  background: ${rgba(colors.colorCoreDarkBlue, 0.08)};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;

  i {
    font-size: 26px;
  }
`;

export const Meta = styled.div`
  position: relative;
  font-weight: 500;
  color: ${colors.colorCoreGray};

  > * + * {
    margin-left: 10px;
  }
`;

const AttachmentName = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 200px;
`;

type Props = {
  attachments: IAttachment[];
  scrollBottom?: () => void;
  additionalItem?: React.ReactNode;
  simple?: boolean;
  marginBottom?: number;
};

class Attachments extends React.Component<Props> {
  onLoadImage = () => {
    const { scrollBottom } = this.props;

    if (scrollBottom) {
      scrollBottom();
    }
  };

  renderOtherInfo = attachment => {
    const name = attachment.name || attachment.url || '';

    return (
      <>
        <h5>
          <AttachmentName>{name}</AttachmentName>
          <Download
            rel="noopener noreferrer"
            href={readFile(attachment.url)}
            target="_blank"
          >
            <Icon icon="down-arrow" />
          </Download>
        </h5>
        <Meta>
          {attachment.size && (
            <span>Size: {Math.round(attachment.size / 1000)}kB</span>
          )}
          {this.props.additionalItem}
        </Meta>
      </>
    );
  };

  renderOtherFile = (attachment, icon) => {
    return (
      <AttachmentWrapper>
        <PreviewWrapper>
          <Icon icon={icon} />
        </PreviewWrapper>
        <ItemInfo>{this.renderOtherInfo(attachment)}</ItemInfo>
      </AttachmentWrapper>
    );
  };

  renderVideoFile = attachment => {
    return (
      <AttachmentWrapper>
        <ItemInfo>
          <video controls={true} loop={true}>
            <source src={attachment.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </ItemInfo>
      </AttachmentWrapper>
    );
  };

  switchItem = index => {
    const item = this.props.attachments[index];

    return item.url;
  };

  getImages = () => {
    const images: IAttachment[] = [];

    this.props.attachments.forEach(attachment => {
      if (attachment.type.startsWith("image")) {
        images.push(attachment);
      }
    });

    return images;
  }

  renderImagePreview(image: IAttachment) {
    return (
      <ImageWithPreview
        images={this.getImages()}
        defaultImage={image}
        onLoad={this.onLoadImage}
      />
    );
  }

  renderAttachment = (attachment) => {
    if (!attachment.type) {
      return null;
    }

    const { simple } = this.props;

    if (attachment.type.startsWith('image')) {
      if (simple) {
        return this.renderImagePreview(attachment);
      }

      return (
        <AttachmentWrapper>
          <PreviewWrapper>{this.renderImagePreview(attachment)}</PreviewWrapper>
          <ItemInfo>{this.renderOtherInfo(attachment)}</ItemInfo>
        </AttachmentWrapper>
      );
    }

    const url = attachment.url || attachment.name || '';
    const fileExtension = url.split('.').pop();

    let filePreview;

    switch (fileExtension) {
      case 'png':
      case 'jpeg':
      case 'doc':
      case 'docx':
      case 'txt':
      case 'pdf':
      case 'xls':
      case 'xlsx':
      case 'ppt':
      case 'pptx':
        filePreview = this.renderOtherFile(attachment, 'file');
        break;
      case 'mp4':
        filePreview = this.renderVideoFile(attachment);
        break;
      case 'avi':
        filePreview = this.renderOtherFile(attachment, 'videocamera');
        break;
      case 'mp3':
      case 'wav':
        filePreview = this.renderOtherFile(attachment, 'music');
        break;
      case 'zip':
        filePreview = this.renderOtherFile(attachment, 'cube');
        break;
      default:
        filePreview = this.renderOtherFile(attachment, 'clipboard-1');
    }
    return filePreview;
  };

  render() {
    const { attachments, marginBottom } = this.props;

    return attachments.map((item, index) =>
      (<div key={index} style={{ marginBottom: marginBottom || 0 }}>
        {this.renderAttachment(item)}
      </div>
      )
    );
  }
}

export default Attachments;